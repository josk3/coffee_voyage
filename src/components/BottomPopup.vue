<template>
  <view v-if="modelValue" class="popup-container">
    <!-- 灰色遮罩 -->
    <view class="popup-mask" @click="handleMaskClick"></view>
    <!-- 内容区域 -->
    <view class="popup-content" :style="{ height: contentHeight }">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: 'auto'
  },
  maskClose: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

// 内容高度
const contentHeight = ref(props.height);

// 点击遮罩
const handleMaskClick = () => {
  if (props.maskClose) {
    emit('update:modelValue', false);
    emit('close');
  }
};

// 监听显示状态
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    // 打开时的动画或操作
    console.log('弹窗显示');
  } else {
    // 关闭时的动画或操作
    console.log('弹窗隐藏');
  }
});

// 处理安卓返回键
onMounted(() => {
  // #ifdef APP-PLUS
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  const currentWebview = page.$getAppWebview();
  
  currentWebview.addEventListener('hardwareBackPress', () => {
    if (props.modelValue) {
      emit('update:modelValue', false);
      emit('close');
      return true;
    }
    return false;
  });
  // #endif
});
</script>

<style lang="scss">
.popup-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  
  .popup-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9998;
  }
  
  .popup-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
    background-color: #fff;
    border-radius: 24rpx 24rpx 0 0;
    overflow: hidden;
    transform: translateY(0);
    transition: transform 0.3s;
    
    &.hidden {
      transform: translateY(100%);
    }
  }
}
</style> 