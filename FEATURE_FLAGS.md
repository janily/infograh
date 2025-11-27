# Feature Flags 功能开关说明

## 概述

本项目使用功能开关（Feature Flags）来控制不同功能模块的显示与隐藏，便于开发和逐步上线功能。

## 配置文件

所有功能开关定义在 `config/feature-flags.ts` 文件中。

## 当前功能开关

### 首页模块

```typescript
SHOW_HOW_IT_WORKS: false    // How it Works 区域
SHOW_PRICING: false          // Pricing 定价区域
```

### 用户认证功能

```typescript
SHOW_AUTH: false            // 登录/注册按钮和用户菜单
SHOW_GITHUB_STAR: false     // GitHub Star 按钮
```

### 导航功能

```typescript
SHOW_DASHBOARD_LINK: false  // Dashboard 管理后台链接
```

### 未来功能（预留）

```typescript
SHOW_TESTIMONIALS: false    // 用户评价区域
SHOW_FAQ: false             // 常见问题区域
```

## 如何启用功能

### 1. 修改配置文件

编辑 `config/feature-flags.ts`，将对应的功能开关设置为 `true`：

```typescript
export const FEATURE_FLAGS = {
  SHOW_HOW_IT_WORKS: true,   // ✅ 启用
  SHOW_PRICING: true,         // ✅ 启用
  // ... 其他配置
} as const;
```

### 2. 保存文件

保存后，开发服务器会自动重新加载（hot reload），无需重启。

### 3. 刷新浏览器

刷新浏览器即可看到启用的功能。

## 功能说明

### ✅ 已实现的功能开关

| 功能 | 开关名称 | 影响范围 | 状态 |
|------|---------|---------|------|
| How it Works | `SHOW_HOW_IT_WORKS` | 首页 + 导航栏 | ❌ 关闭 |
| Pricing | `SHOW_PRICING` | 首页 + 导航栏 | ❌ 关闭 |
| 导航栏链接 | 自动同步 | 根据上述开关自动更新 | ✅ 已实现 |

### 📋 已移除的功能

| 功能 | 移除位置 | 说明 |
|------|---------|------|
| GitHub Star 按钮 | 导航栏 | 已从代码中移除 |
| Sign In 按钮 | 导航栏 | 已从代码中移除 |
| User Menu | 导航栏 | 已从代码中移除 |

## 开发建议

### 开发新功能时

1. 在 `feature-flags.ts` 中添加新的开关
2. 在对应组件中使用条件渲染
3. 默认设置为 `false`（关闭）
4. 功能开发完成后再设置为 `true`（开启）

### 示例：添加新功能开关

```typescript
// 1. 在 feature-flags.ts 中添加
export const FEATURE_FLAGS = {
  // ...
  SHOW_NEW_FEATURE: false,  // 新功能开关
} as const;

// 2. 在组件中使用
import { FEATURE_FLAGS } from '@/config/feature-flags';

export default function Page() {
  return (
    <>
      {FEATURE_FLAGS.SHOW_NEW_FEATURE && <NewFeature />}
    </>
  );
}
```

## 生产环境注意事项

在部署到生产环境前，请检查：

1. ✅ 确认所有要上线的功能开关已设置为 `true`
2. ✅ 确认不需要的功能开关设置为 `false`
3. ✅ 测试所有启用的功能正常工作
4. ✅ 检查导航栏链接是否正确

## 当前配置（2025年11月）

```typescript
SHOW_HOW_IT_WORKS: false     // 暂时关闭，后续开发
SHOW_PRICING: false          // 暂时关闭，后续开发
SHOW_AUTH: false             // 已移除相关代码
SHOW_GITHUB_STAR: false      // 已移除相关代码
SHOW_DASHBOARD_LINK: false   // 暂时关闭
```

## 快速启用所有功能

如需一键启用所有功能（用于测试），可以批量修改：

```typescript
export const FEATURE_FLAGS = {
  SHOW_HOW_IT_WORKS: true,
  SHOW_PRICING: true,
  SHOW_AUTH: true,
  SHOW_GITHUB_STAR: true,
  SHOW_DASHBOARD_LINK: true,
  SHOW_TESTIMONIALS: true,
  SHOW_FAQ: true,
} as const;
```

