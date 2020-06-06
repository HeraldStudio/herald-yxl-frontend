const vm = new Vue({
  el: '#app',
  data() {
    return {
      // 原始信息
      original: [
        { id: 1, name: '徐潇航', avatar: './avatars/xxh.jpg' },
        { id: 2, name: '郝世杰', avatar: './avatars/hsj.jpg' },
        { id: 3, name: '王家政', avatar: './avatars/wjz.jpg' },
        { id: 4, name: '李佞偈', avatar: './avatars/lnj.jpg' },
        { id: 5, name: '王绍勇', avatar: './avatars/wsy.jpg' },
        { id: 6, name: '王宗辉', avatar: './avatars/wzh.jpg' },
        { id: 7, name: '顾欣怡', avatar: './avatars/gxy.jpg' },
        { id: 8, name: '陆涵之', avatar: './avatars/lhz.jpg' },
        { id: 9, name: '陈佳龙', avatar: './avatars/cjl.jpg' },
        { id: 10, name: '李想', avatar: './avatars/lx.jpg' },
        { id: 11, name: '高睿昊', avatar: './avatars/grh.jpg' },
        { id: 12, name: '徐易', avatar: './avatars/xy.jpg' },
        { id: 13, name: '宋毅恒', avatar: './avatars/syh.jpg' },
        { id: 14, name: '万思远', avatar: './avatars/wsy2.jpg' },
        { id: 15, name: '向欣雅', avatar: './avatars/xxy.jpg' },
      ].map(k => Object.assign(k, {
        total: 0,
        normalTotal: 0,
        specialTotal: 0,
      })),
      // 投票结果
      candidateRes: null,
      candidates: null,
      pendingCandidates: [],
      duration: 15000,
      shown: false,
      animating: false
    }
  },
  async created() {
   
    // 一个深拷贝
    this.candidateRes = this.deepClone(this.original)
    // 获取投票结果
    let res = await axios.get('https://xgbxscwx.seu.edu.cn/api/yxl/vote-result')
    .then(
      ret =>{
        return ret.data.success ? ret.data.result : []
      }
    )
    res.forEach((item) => {
      let candidateID = + Object.keys(item)[0]
      this.candidateRes[candidateID - 1].total = +item[candidateID]
      this.candidateRes[candidateID - 1].normalTotal = +item[candidateID]
    })
    console.log('load')

    this.candidates = this.original
    
    // 监听键盘输入
    document.addEventListener('keydown', e => {
      // 展示投票结果
      if(e.key === 'Enter'){
        if(!this.shown && !this.animating){
          console.log('show')
          this.load({ candidate: this.candidateRes })
          this.show()
        }
      }
      // 清空投票结果
      if(e.key === 'c'){
        location.reload()
      }
    })
    // 拖入文件加载票数
    // document.body.ondragleave = e => e.preventDefault()
    // document.body.ondrop = async e => {
    //   e.stopPropagation()
    //   e.preventDefault()
    //   let file = e.dataTransfer.files[0]
    //   let reader = new FileReader()
    //   let skeleton = JSON.parse(JSON.stringify(this.original))
    //   reader.onload = e => {
    //     let data = e.target.result
    //     let workbook = XLSX.read(data, { type: 'binary' })

    //     let csv = XLSX.utils.sheet_to_csv(workbook.Sheets.Sheet1)
    //     csv = csv.split('\n').filter(k => /^.+(,.+){4}$/.test(k)).slice(1).map(k => {
    //       let [ id, name, total, specialTotal, normalTotal ] = k.split(',')
    //       id = parseInt(id)
    //       total = parseFloat(total)
    //       normalTotal = parseFloat(normalTotal)
    //       specialTotal = parseFloat(specialTotal)
    //       return { id, name, total, specialTotal, normalTotal }
    //     }).sort((a, b) => a.id - b.id).slice(0, 20).map((k, i) => Object.assign(skeleton[i], k))
        
    //     this.load({ candidate: csv })
    //   }
    //   reader.readAsBinaryString(file)
    // }
    // document.body.ondragenter = e => e.preventDefault()
    // document.body.ondragover = e => e.preventDefault()
  },
  computed: {
    maxTotal() {
      // 时时计算最大投票数
      return this.candidates.map(k => Number(k.total)).reduce((a, b) => a > b ? a : b, 1)
    }
  },
  methods: {
    async load(data) {
      // console.log('load')
      let { candidate } = data
      this.pendingCandidates = candidate
    },
    show() {
      if (this.shown || this.animating) {
        return
      }
      // console.log('show')
      this.animating = true
      this.candidates = this.pendingCandidates
      setTimeout(() => {
        this.pendingCandidates = null
        this.candidates.sort((a, b) => b.total - a.total)
        this.shown = true
        this.animating = false
      }, this.duration)
    },
    // 工具函数
    deepClone(obj){
      let objClone = Array.isArray(obj)?[]:{};
      if(obj && typeof obj==="object"){
        for(key in obj){
          if(obj.hasOwnProperty(key)){
            if(obj[key]&&typeof obj[key] ==="object"){
              objClone[key] = this.deepClone(obj[key]);
            }else{
              objClone[key] = obj[key];
            }
          }
        }
      }
      return objClone;
    }    
  }
})