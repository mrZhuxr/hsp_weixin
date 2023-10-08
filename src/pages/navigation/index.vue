<template>
    <view class="content">{{ latitude }} {{ longitude }}</view>
</template>

<script>
export default {
    data() {
        return {
            latitude: '',
            longitude: ''
        }
    },
    onLoad(options) {
        this.latitude = options.latitude
        this.longitude = options.longitude
        uni.getLocation({
            success: (res) => {
                uni.openLocation({
                    latitude: parseFloat(options.latitude),
                    longitude: parseFloat(options.longitude),
                    scale: 18,
                    name: options.name,
                    title: options.title
                })
            }
        })
    },
    mounted() {},
    methods: {
        // 确认授权后，获取用户位置
        getLocationInfo() {
            const that = this
            uni.getLocation({
                type: 'gcj02',
                success: function (res) {
                    // 暂时
                    that.longitude = res.longitude //118.787575;
                    that.latitude = res.latitude //32.05024;
                    console.log('获取当前的用户经度', that.longitude)
                    console.log('获取当前的用户纬度', that.latitude)
                    var long = 0
                    var lat = 0
                    //小数点保留六位  经度
                    if (that.longitude.toString().indexOf('.') > 0) {
                        const longlatsplit = that.longitude.toString().split('.')
                        if (longlatsplit.length >= 2) {
                            long =
                                parseFloat(longlatsplit[0] === '' ? 0 : longlatsplit[0]) +
                                parseFloat('.' + longlatsplit[1].slice(0, 6))
                        }
                    }
                    if (that.latitude.toString().indexOf('.') > 0) {
                        const longlatsplit1 = that.latitude.toString().split('.')
                        if (longlatsplit1.length >= 2) {
                            lat =
                                parseFloat(longlatsplit1[0] === '' ? 0 : longlatsplit1[0]) +
                                parseFloat('.' + longlatsplit1[1].slice(0, 6))
                        }
                    }
                    // cookie.set("longitude", long);
                    // cookie.set("latitude", lat);
                    console.log('纬度', lat)
                    // this.distance(that.latitude,that.longitude);
                    that.markers = [
                        {
                            id: '',
                            latitude: res.latitude,
                            longitude: res.longitude,
                            iconPath: '../../static/img/phone.png',
                            width: that.markerHeight, //宽
                            height: that.markerHeight //高
                        }
                    ]
                    that.getList()
                }
            })
        },
        // 拒绝授权后，弹框提示是否手动打开位置授权
        openConfirm() {
            return new Promise((resolve, reject) => {
                uni.showModal({
                    title: '请求授权当前位置',
                    content: '我们需要获取地理位置信息，为您推荐附近的美食',
                    success: (res) => {
                        if (res.confirm) {
                            uni.openSetting().then((res) => {
                                if (res[1].authSetting['scope.userLocation'] === true) {
                                    resolve() // 打开地图权限设置
                                } else {
                                    reject()
                                }
                            })
                        } else if (res.cancel) {
                            reject()
                        }
                    }
                })
            })
        },

        // 彻底拒绝位置获取
        rejectGetLocation() {
            uni.showToast({
                title: '你拒绝了授权，无法获得周边信息',
                icon: 'none',
                duration: 2000
            })
        },
        getList() {
            console.log('获取周围美食')
        },
        onReady() {
            //   wx请求获取位置权限
            this.getAuthorize()
                .then(() => {
                    //   同意后获取
                    this.getLocationInfo()
                })
                .catch(() => {
                    //   不同意给出弹框，再次确认
                    this.openConfirm()
                        .then(() => {
                            this.getLocationInfo()
                        })
                        .catch(() => {
                            this.rejectGetLocation()
                        })
                })
        },
        openMap(lon, lat) {
            console.log('获取经纬度ssssfff', lon, lat)
            //打开地图，并将门店位置传入
            uni.getLocation({
                success: (res) => {
                    // res.latitude=lat;
                    // res.longitude=lon;
                    console.log('location success', parseFloat(lat), parseFloat(lon))
                    uni.openLocation({
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lon),
                        scale: 18
                    })
                }
            })
        },

        //   初次位置授权
        getAuthorize() {
            return new Promise((resolve, reject) => {
                uni.authorize({
                    scope: 'scope.userLocation',
                    success: () => {
                        resolve() // 允许授权
                    },
                    fail: () => {
                        reject() // 拒绝授权
                    }
                })
            })
        }
    }
}
</script>
