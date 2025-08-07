# Vue项目PDF预览解决方案：vue-pdf-embed与pdfjs-dist完全指南

## 前言

最近在重构采集卡项目中遇到了一些关于pdf预览的需求，要求在pc端、移动端、各种客户端浏览器中提供一致的交互和良好的PDF预览体验。本文将总结了解决pdf预览需求的最佳实践，重点介绍`vue-pdf-embed`和`pdfjs-dist`两个核心库的使用方法，以及在实际开发中遇到的常见问题和解决方案。

## 技术选型：为什么选择vue-pdf-embed？

### 1. 技术架构优势

`vue-pdf-embed`是基于Mozilla的PDF.js构建的Vue 3组件，它提供了以下核心优势：

- **原生Vue 3支持**：专为Vue 3设计，提供了完整的TypeScript类型定义
- **零依赖配置**：开箱即用，无需额外的peer dependencies
- **功能丰富**：支持文本选择、注释显示、密码保护文档等
- **性能优化**：内置懒加载和文档代理机制

### 2. 与其他方案的对比

| 方案 | 优势 | 劣势 |
|------|------|------|
| vue-pdf-embed | Vue原生支持，功能完整 | 仅支持Vue 3 |
| react-pdf | React生态成熟 | 需要适配Vue |
| iframe嵌入 | 简单快速 | 样式控制受限，安全性问题 |
| pdf.js原生 | 功能最全面 | 集成复杂度高 |

## 基础集成实现

### 1. 安装依赖

```bash
# 安装核心依赖
npm install vue-pdf-embed

# 可选：安装pdfjs-dist用于高级配置
npm install pdfjs-dist
```

### 2. 基础组件实现

```vue
<template>
  <div class="pdf-viewer">
    <VuePdfEmbed 
      :source="pdfSource"
      :page="currentPage"
      :scale="scale"
      :rotation="rotation"
      annotation-layer
      text-layer
      @loaded="onDocumentLoaded"
      @loading-failed="onLoadingFailed"
      @rendered="onDocumentRendered"
      @password-requested="onPasswordRequested"
    />
    
    <!-- 控制工具栏 -->
    <div class="pdf-controls">
      <button @click="previousPage" :disabled="currentPage <= 1">上一页</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages">下一页</button>
      
      <button @click="zoomOut">缩小</button>
      <span>{{ Math.round(scale * 100) }}%</span>
      <button @click="zoomIn">放大</button>
      
      <button @click="rotate">旋转</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
})

const pdfSource = ref(props.pdfUrl)
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1.0)
const rotation = ref(0)

const onDocumentLoaded = (pdf) => {
  console.log('PDF文档加载成功')
  totalPages.value = pdf.numPages
}

const onLoadingFailed = (error) => {
  console.error('PDF加载失败:', error)
}

const onDocumentRendered = () => {
  console.log('PDF渲染完成')
}

const onPasswordRequested = (callback, isWrongPassword) => {
  const password = prompt(
    isWrongPassword ? '密码错误，请重新输入:' : '请输入PDF密码:'
  )
  callback(password)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 3.0)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.5)
}

const rotate = () => {
  rotation.value = (rotation.value + 90) % 360
}
</script>

<style scoped>
.pdf-viewer {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.pdf-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
}

.pdf-controls button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.pdf-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

## 高级功能实现

### 1. Web Worker配置优化

在生产环境中，为了满足CSP（内容安全策略）要求，需要手动配置Web Worker：

```javascript
// composables/usePdfWorker.js
import { GlobalWorkerOptions } from 'vue-pdf-embed/dist/index.essential.mjs'

export function setupPdfWorker() {
  // 方案1：使用CDN
  GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js'
  
  // 方案2：使用本地文件（推荐生产环境）
  // GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
  
  // 方案3：使用动态导入
  // import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
  // GlobalWorkerOptions.workerSrc = PdfWorker
}
```

### 2. 文档预加载与缓存

```javascript
// composables/usePdfCache.js
import { ref, reactive } from 'vue'
import { useVuePdfEmbed } from 'vue-pdf-embed'

const documentCache = reactive(new Map())

export function usePdfCache() {
  const loadDocument = async (url) => {
    if (documentCache.has(url)) {
      return documentCache.get(url)
    }
    
    try {
      const { doc } = useVuePdfEmbed({ source: url })
      documentCache.set(url, doc)
      return doc
    } catch (error) {
      console.error('文档预加载失败:', error)
      throw error
    }
  }
  
  const clearCache = () => {
    documentCache.clear()
  }
  
  return {
    loadDocument,
    clearCache,
    cacheSize: computed(() => documentCache.size)
  }
}
```

### 3. 多语言字符支持

```vue
<template>
  <VuePdfEmbed
    :source="pdfSourceWithCMap"
    image-resources-path="https://unpkg.com/pdfjs-dist/web/images/"
    annotation-layer
    text-layer
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['pdfUrl'])

const pdfSourceWithCMap = computed(() => ({
  url: props.pdfUrl,
  cMapUrl: 'https://unpkg.com/pdfjs-dist/cmaps/',
  cMapPacked: true
}))
</script>
```

## 常见问题与解决方案

### 1. 服务器端渲染（SSR）问题

**问题描述**：在Nuxt.js等SSR框架中使用时报错"window is not defined"

**解决方案**：
```vue
<template>
  <div>
    <ClientOnly>
      <VuePdfEmbed :source="pdfSource" />
    </ClientOnly>
  </div>
</template>

<script setup>
// Nuxt 3
const VuePdfEmbed = import('vue-pdf-embed').then(m => m.default)
</script>
```

或者使用动态导入：
```javascript
// plugins/pdf-embed.client.js
export default defineNuxtPlugin(() => {
  // 只在客户端加载
})
```

### 2. 大文件加载性能问题

**问题描述**：加载大型PDF文件时页面卡顿，用户体验差

**解决方案**：
```vue
<template>
  <div class="pdf-container">
    <div v-if="loading" class="loading-indicator">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      <p>加载中... {{ loadingProgress }}%</p>
    </div>
    
    <VuePdfEmbed
      v-else
      :source="pdfSource"
      :page="visiblePages"
      @progress="onLoadingProgress"
      @loaded="onLoaded"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const loading = ref(true)
const loadingProgress = ref(0)
const currentPage = ref(1)
const pageSize = ref(3) // 每次只渲染3页

const visiblePages = computed(() => {
  const start = Math.max(1, currentPage.value - 1)
  const end = Math.min(totalPages.value, currentPage.value + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const onLoadingProgress = ({ loaded, total }) => {
  loadingProgress.value = Math.round((loaded / total) * 100)
}

const onLoaded = () => {
  loading.value = false
}
</script>
```

### 3. 跨域资源访问问题

**问题描述**：加载跨域PDF文件时遇到CORS错误

**解决方案**：
```javascript
// 方案1：使用代理服务器
const pdfSource = computed(() => ({
  url: `/api/proxy-pdf?url=${encodeURIComponent(props.pdfUrl)}`,
  withCredentials: false
}))

// 方案2：转换为Base64
const loadPdfAsBase64 = async (url) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('转换PDF为Base64失败:', error)
    throw error
  }
}
```

### 4. 移动端适配问题

**问题描述**：在移动设备上PDF显示异常，触摸操作不友好

**解决方案**：
```vue
<template>
  <div class="mobile-pdf-viewer" :class="{ 'is-mobile': isMobile }">
    <VuePdfEmbed
      :source="pdfSource"
      :width="containerWidth"
      :scale="mobileScale"
      @rendered="onRendered"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)
const containerWidth = ref(0)

const mobileScale = computed(() => {
  return isMobile.value ? 0.8 : 1.0
})

const updateViewport = () => {
  isMobile.value = window.innerWidth <= 768
  containerWidth.value = window.innerWidth - 40 // 减去padding
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
  window.addEventListener('orientationchange', updateViewport)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport)
  window.removeEventListener('orientationchange', updateViewport)
})
</script>

<style scoped>
.mobile-pdf-viewer.is-mobile {
  touch-action: pan-x pan-y;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .mobile-pdf-viewer {
    padding: 10px;
  }
}
</style>
```

### 5. 内存泄漏问题

**问题描述**：频繁切换PDF文档导致内存占用持续增长

**解决方案**：
```javascript
// composables/usePdfMemoryManagement.js
import { onUnmounted, ref } from 'vue'

export function usePdfMemoryManagement() {
  const documentRefs = ref([])
  
  const registerDocument = (doc) => {
    documentRefs.value.push(doc)
  }
  
  const cleanup = () => {
    documentRefs.value.forEach(doc => {
      if (doc && typeof doc.destroy === 'function') {
        doc.destroy()
      }
    })
    documentRefs.value = []
  }
  
  onUnmounted(() => {
    cleanup()
  })
  
  return {
    registerDocument,
    cleanup
  }
}
```

### 6. 打印功能实现

**问题描述**：用户需要打印PDF文档

**解决方案**：
```vue
<template>
  <div>
    <VuePdfEmbed
      ref="pdfRef"
      :source="pdfSource"
    />
    <button @click="printPdf">打印PDF</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const pdfRef = ref()

const printPdf = async () => {
  try {
    if (pdfRef.value) {
      await pdfRef.value.print(300, 'document.pdf', true)
    }
  } catch (error) {
    console.error('打印失败:', error)
    // 降级方案：使用浏览器打印
    window.print()
  }
}
</script>
```

## 性能优化策略

### 1. 虚拟滚动实现

对于页数很多的PDF文档，实现虚拟滚动可以显著提升性能：

```vue
<template>
  <div class="virtual-pdf-viewer" @scroll="onScroll">
    <div class="pdf-container" :style="{ height: `${totalHeight}px` }">
      <div
        v-for="page in visiblePages"
        :key="page"
        class="pdf-page"
        :style="getPageStyle(page)"
      >
        <VuePdfEmbed
          :source="pdfSource"
          :page="page"
          :width="pageWidth"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const pageHeight = 800
const pageWidth = 600
const visibleRange = 3

const currentPage = ref(1)
const totalPages = ref(100)
const scrollTop = ref(0)

const totalHeight = computed(() => totalPages.value * pageHeight)

const visiblePages = computed(() => {
  const startPage = Math.max(1, Math.floor(scrollTop.value / pageHeight) - visibleRange)
  const endPage = Math.min(totalPages.value, startPage + visibleRange * 2)
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
})

const getPageStyle = (page) => ({
  position: 'absolute',
  top: `${(page - 1) * pageHeight}px`,
  height: `${pageHeight}px`
})

const onScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```

### 2. 预加载策略

```javascript
// composables/usePdfPreloader.js
import { ref } from 'vue'

export function usePdfPreloader() {
  const preloadQueue = ref([])
  const preloadedDocs = ref(new Map())
  
  const preloadDocument = async (url, priority = 0) => {
    if (preloadedDocs.value.has(url)) {
      return preloadedDocs.value.get(url)
    }
    
    preloadQueue.value.push({ url, priority })
    preloadQueue.value.sort((a, b) => b.priority - a.priority)
    
    return processPreloadQueue()
  }
  
  const processPreloadQueue = async () => {
    while (preloadQueue.value.length > 0) {
      const { url } = preloadQueue.value.shift()
      
      try {
        const { doc } = useVuePdfEmbed({ source: url })
        preloadedDocs.value.set(url, doc)
        
        // 限制缓存大小
        if (preloadedDocs.value.size > 10) {
          const firstKey = preloadedDocs.value.keys().next().value
          preloadedDocs.value.delete(firstKey)
        }
      } catch (error) {
        console.error(`预加载失败: ${url}`, error)
      }
    }
  }
  
  return {
    preloadDocument,
    preloadedDocs: readonly(preloadedDocs)
  }
}
```

## 最佳实践总结

### 1. 项目架构建议

```
src/
├── components/
│   ├── PdfViewer/
│   │   ├── index.vue          # 主组件
│   │   ├── PdfControls.vue    # 控制工具栏
│   │   ├── PdfThumbnail.vue   # 缩略图
│   │   └── PdfSearch.vue      # 搜索功能
│   └── common/
├── composables/
│   ├── usePdfViewer.js        # PDF查看器逻辑
│   ├── usePdfWorker.js        # Worker配置
│   └── usePdfCache.js         # 缓存管理
└── utils/
    ├── pdfHelpers.js          # PDF工具函数
    └── constants.js           # 常量定义
```

### 2. 开发规范

1. **错误处理**：始终提供友好的错误提示和降级方案
2. **性能监控**：监控PDF加载时间和内存使用情况
3. **用户体验**：提供加载进度、操作反馈等用户体验优化
4. **安全性**：验证PDF文件来源，防止XSS攻击
5. **兼容性**：考虑不同浏览器和设备的兼容性

### 3. 部署注意事项

```javascript
// vite.config.js 配置示例
export default defineConfig({
  optimizeDeps: {
    include: ['vue-pdf-embed']
  },
  build: {
    rollupOptions: {
      external: ['pdfjs-dist/build/pdf.worker.min.js']
    }
  },
  // 配置静态资源
  assetsInclude: ['**/*.worker.js']
})
```

## 结语

`vue-pdf-embed`结合`pdfjs-dist`为Vue项目提供了强大的PDF预览能力。通过本文介绍的最佳实践和问题解决方案，开发者可以构建出性能优异、用户体验良好的PDF预览功能。在实际项目中，建议根据具体需求选择合适的功能组合，并持续关注性能优化和用户反馈。

记住，PDF预览不仅仅是技术实现，更是用户体验的重要组成部分。只有在技术稳定性和用户体验之间找到最佳平衡，才能真正满足业务需求。
