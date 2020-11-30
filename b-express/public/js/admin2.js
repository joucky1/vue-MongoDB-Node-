Vue.http.options.root = "http://127.0.0.1:8080/"
Vue.http.options.emulateJSON = true

// 上传图片
function doUpload() {
    let file = $('#file').get(0).files[0];

    if(typeof(file) === "undefined"){
        alert("请选择图片")
        return
    }

    let formdata = new FormData();//创建空的formData对象
    // hehe前端上传图片的Key 值 与后端设置的要一样
    formdata.append('hehe', file);
    $.ajax({
        url: 'http://localhost:8080/photo',
        type: 'POST',
        cache: false,//不必须
        data: formdata,
        processData: false,//必须
        contentType: false,
        success: function (data) {
            console.log(data)
        }
    }

    )
}

new Vue({
    el: '#app',
    data: {

        goods_id: "",
        goods_name: "",
        goods_price: "",
        goods_old_price: "",
        goods_src: "http://127.0.0.1:8080/public/img/",
        goods_detail: "",
        goods_list: [],

        ss_goods_name: "",
        Tab: 'one',

        // -------------------商品类别-----------------------
        category_id_value: "",
        category_id_list: [],

        category_id: "",
        category_name: "",
        ss_category_name: "",

        Tab2: "one",

        // --------------------用户--------------------------
        user_list: [],

        ss_user_username: "",

    },
    created() {
        this.get_goods()

        this.get_category_id_list()

        this.get_user()
    },
    methods: {
        // 根据搜索的商品名搜索
        ss(ss_goods_name) {
            var goods_xlist = []
            var goods_xlist = this.goods_list.filter((item) => {
                if (item.goods_name.includes(ss_goods_name)) {
                    return item;
                }
            });
            return goods_xlist;
        },

        //获取所有商品
        get_goods() {
            this.$http.get("select_goods").then(
                result => {
                    this.goods_list = result.body
                }
            )
        },

        // 添加商品
        add_goods() {
            if (this.goods_name == "") {
                alert("商品名不能为空")
                return
            } else {
                var cz = false
                for (var i = 0; i < this.goods_list.length; i++) {
                    if (this.goods_name == this.goods_list[i].goods_name) {
                        cz = true
                    }
                }
                if (cz) {
                    alert("商品名已存在")
                    return
                }
            }

            if (this.goods_price == "") {
                alert("商品单价不能为空")
                return
            } else if (isNaN(this.goods_price)) {
                alert("商品单价不是数字")
                return
            }

            if (this.goods_old_price == "") {
                alert("商品单价不能为空")
                return
            } else if (isNaN(this.goods_old_price)) {
                alert("商品原单价不是数字")
                return
            }

            if (this.goods_src == "") {
                alert("图片名不能为空")
                return
            }

            if (this.category_id_value == "") {
                alert("商品类别不能为空")
                return
            }

            if (this.goods_detail == "") {
                alert("商品详情不能为空")
                return
            }

            this.$http.post("add_goods", {
                goods_name: this.goods_name,
                goods_price: this.goods_price,
                goods_old_price: this.goods_old_price,
                goods_src: this.goods_src,
                category_id: this.category_id_value,
                goods_detail: this.goods_detail
            }).then(
                result => {
                    this.get_goods()
                    this.goods_name = ""
                    this.goods_price = ""
                    this.goods_old_price = ""
                    this.goods_src = "http://127.0.0.1:8080/public/img/"
                    this.category_id_value = ""
                    this.goods_detail = ""
                    alert("添加成功")
                    this.Tab = "one"
                }
            )
        },

        // 删除商品
        delete_goods(id) {
            if (!confirm("是否删除该商品")) {
                return
            }
            this.$http.get("delete_goods/" + id)
                .then(
                    result => {
                        this.get_goods()
                    }
                )
        },

        // 修改商品
        update_goods(id, name, price, old_price, src, category_id, detail) {
            this.Tab = "three"
            this.goods_id = id
            this.goods_name = name
            this.goods_price = price
            this.goods_old_price = old_price
            this.goods_src = src
            this.category_id_value = category_id
            this.goods_detail = detail
        },
        update_goods2() {
            if (this.goods_id == "") {
                alert("商品ID不能为空")
                return
            } else if (isNaN(this.goods_id)) {
                alert("商品ID不是数字")
                return
            } else {
                var cz = true
                for (var i = 0; i < this.goods_list.length; i++) {
                    if (this.goods_id == this.goods_list[i].goods_id) {
                        cz = false
                    }
                }
                if (cz) {
                    alert("该商品ID不存在")
                    return
                }
            }

            if (this.goods_name == "") {
                alert("商品名不能为空")
                return
            } else {
                var cz2 = false

                for (var i = 0; i < this.goods_list.length; i++) {
                    if (this.goods_id == this.goods_list[i].goods_id) {
                        continue
                    }

                    if (this.goods_name == this.goods_list[i].goods_name) {
                        cz2 = true
                    }
                }
                if (cz2) {
                    alert("商品名已存在")
                    return
                }
            }

            if (this.goods_price === "") {
                alert("商品单价不能为空")
                return
            } else if (isNaN(this.goods_price)) {
                alert("商品单价不是数字")
                return
            }

            if (this.goods_old_price === "") {
                alert("商品单价不能为空")
                return
            } else if (isNaN(this.goods_old_price)) {
                alert("商品原单价不是数字")
                return
            }

            if (this.goods_src == "") {
                alert("图片名不能为空")
                return
            }

            if (this.category_id_value == "") {
                alert("商品类别不能为空")
                return
            }

            if (this.goods_detail == "") {
                alert("商品详情不能为空")
                return
            }

            this.$http.post("update_goods", {
                goods_id: this.goods_id,
                goods_name: this.goods_name,
                goods_price: this.goods_price,
                goods_old_price: this.goods_old_price,
                goods_src: this.goods_src,
                category_id: this.category_id_value,
                goods_detail: this.goods_detail
            }).then(
                result => {
                    this.get_goods()
                    this.goods_id = ""
                    this.goods_name = ""
                    this.goods_price = ""
                    this.goods_old_price = ""
                    this.goods_src = "http://127.0.0.1:8080/public/img/"
                    this.category_id_value = ""
                    this.goods_detail = ""
                    alert("修改成功")
                    this.Tab = "one"
                }
            )
        },

        // 商品的添加输入清空
        f1() {
            this.goods_name = ""
            this.goods_price = ""
            this.goods_old_price = ""
            this.goods_src = "http://127.0.0.1:8080/public/img/"
            this.category_id_value = ""
            this.goods_detail = ""
        },

        // 商品的修改输入清空
        f2() {
            this.goods_id = ""
            this.goods_name = ""
            this.goods_price = ""
            this.goods_old_price = ""
            this.goods_src = "http://127.0.0.1:8080/public/img/"
            this.category_id_value = ""
            this.goods_detail = ""
        },


        // ----------------------------商品类别--------------------------------------------------

        // 商品类别名搜索
        ss_category(ss_category_name) {
            var category_xlist = []
            var category_xlist = this.category_id_list.filter((item) => {
                if (item.category_name.includes(ss_category_name)) {
                    return item;
                }
            });
            return category_xlist;
        },

        // 获取商品类别
        get_category_id_list() {
            this.$http.get("select_category").then(result => {
                this.category_id_list = result.body
            })
        },

        // 添加商品类别
        add_category() {
            if (this.category_name == "") {
                alert("商品名不能为空")
                return
            } else {
                var cz = false
                for (var i = 0; i < this.category_id_list.length; i++) {
                    if (this.category_name == this.category_id_list[i].category_name) {
                        cz = true
                    }
                }
                if (cz) {
                    alert("商品类别名已存在")
                    return
                }
            }

            this.$http.post("add_category", {
                category_name: this.category_name,
            }).then(
                result => {
                    this.get_category_id_list()
                    this.category_name = ""
                    alert("添加成功")
                    this.Tab2 = "one"
                }
            )
        },

        // 删除商品类别
        delete_category(id) {
            if (!confirm("是否删除该商品类别")) {
                return
            }
            this.$http.get("delete_category/" + id)
                .then(
                    result => {
                        this.get_category_id_list()
                    }
                )
        },

        // 修改商品类别名
        update_catrgory(id, name) {
            this.Tab2 = "three"
            this.category_id = id
            this.category_name = name
        },
        update_category2() {
            if (this.category_id == "") {
                alert("商品类别ID不能为空")
                return
            } else if (isNaN(this.category_id)) {
                alert("商品类别ID不是数字")
                return
            } else {
                var cz = true
                for (var i = 0; i < this.category_id_list.length; i++) {
                    if (this.category_id == this.category_id_list[i].category_id) {
                        cz = false
                    }
                }
                if (cz) {
                    alert("该商品类别ID不存在")
                    return
                }
            }

            if (this.category_name == "") {
                alert("商品名不能为空")
                return
            } else {
                var cz2 = false

                for (var i = 0; i < this.category_id_list.length; i++) {
                    if (this.category_id == this.category_id_list[i].category_id) {
                        continue
                    }

                    if (this.category_name == this.category_id_list[i].category_name) {
                        cz2 = true
                    }
                }
                if (cz2) {
                    alert("商品类别名已存在")
                    return
                }
            }

            this.$http.post("update_category", {
                category_id: this.category_id,
                category_name: this.category_name,
            }).then(
                result => {
                    this.get_category_id_list()
                    this.category_id = ""
                    this.category_name = ""
                    alert("修改成功")
                    this.Tab2 = "one"
                }
            )
        },

        // 商品的添加输入清空
        f3() {
            this.category_name = ""
        },

        // 商品的添加输入清空
        f4() {
            this.category_id = ""
            this.category_name = ""
        },


        // ----------------------------用户------------------------------------------------------

        // 用户账号搜索
        ss_user(ss_user_username) {
            var user_xlist = []
            var user_xlist = this.user_list.filter((item) => {
                if (toString(item.user_username).includes(ss_user_username)) {
                    return item;
                }
            });
            return user_xlist;
        },

        //获取所有用户
        get_user() {
            this.$http.get("select_user_list").then(
                result => {
                    this.user_list = result.body
                }
            )
        },

        // 删除用户
        delete_user(id) {
            if (!confirm("是否删除该用户")) {
                return
            }
            this.$http.get("delete_user/" + id)
                .then(
                    result => {
                        this.get_user()
                    }
                )
        },

    },
})