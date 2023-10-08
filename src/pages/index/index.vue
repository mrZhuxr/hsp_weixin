<template>
    <!-- <web-view
        :src="`https://showroom-oss.vitoreality.com/Oasis_HSP/index.html#/login?openid=${loginCode}`"
    ></web-view> -->
    <web-view
        :src="`https://showroom-oss.vitoreality.com/Oasis_HSP/index.html#/login?openid=${loginCode}&nickName=${nickName}&avatarUrl=${avatarUrl}`"
    ></web-view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loginCode = ref('')
const nickName = ref('')
const avatarUrl = ref('')
const login_button = ref<HTMLButtonElement | null>(null)
onMounted(() => {
    uni.login({
        success: function (res) {
            if (res.code) {
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

const getUserProfile = async () => {
    const { userInfo } = await uni.getUserProfile({ desc: '用于完善个人资料' })
    console.log('🚀 ~ file: index.vue:39 ~ getUserProfile ~ userInfo:', userInfo)
    nickName.value = userInfo.nickName
    avatarUrl.value = userInfo.avatarUrl
}
</script>
