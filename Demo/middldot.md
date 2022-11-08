### 部门中间缩略显示
```
<style>
        .dept {
            width: 390px;
            height: 12px;
            line-height: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 400;
            color: #6a6d7b;
            margin-bottom: 9px;

            .dept-main {
                width: 100%;
                height: 12px;
                display: flex;
                overflow: hidden;

                .prev-span {
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .next-span {
                    display: block;
                    white-space: nowrap;
                    // direction: rtl;
                }
            }
        }
    </style>
```

```
<div class="dept">
        <div class="dept-main" v-if="user.dept_name.length > 10">
            <span class="prev-span">{{ user.dept_name.slice(0, 8) }}</span>
            <span class="next-span">{{
                user.dept_name.slice(8, user.dept_name.length)
                }}</span>
        </div>
        <div v-else>{{ item.dept }}</div>
    </div>
```
