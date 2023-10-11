<template>
    <web-view
        :src="`https://showroom-oss.vitoreality.com/Oasis_HSP/index.html#/login?wxCode=${loginCode}`"
    ></web-view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loginCode = ref('')
const login_button = ref<HTMLButtonElement | null>(null)
onMounted(() => {
    uni.login({
        success: function (res) {
            if (res.code) {
                console.log('🚀 ~ file: index.vue:16 ~ onMounted ~ res.code:', res.code)
                loginCode.value = res.code
                // 获取到了res.code
            } else {
                console.log('获取用户登录态失败！' + res.errMsg)
            }
        }
    })
    console.log(login_button.value)

    login_button.value?.click()
})
</script>
