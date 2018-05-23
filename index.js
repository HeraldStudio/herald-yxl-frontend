const vm = new Vue({
  el: '#app',
  data() {
    return {
      candidates: [
        { id: 1, name: '江苏', avatar: 'http://static.myseu.cn/2018-05-22-153041.png' },
        { id: 2, name: '黄鑫晨', avatar: 'http://static.myseu.cn/2018-05-22-153125.png' },
        { id: 3, name: '王奕阳', avatar: 'http://static.myseu.cn/2018-05-22-153143.png' },
        { id: 4, name: '况璐莎', avatar: 'http://static.myseu.cn/2018-05-22-153340.png' },
        { id: 5, name: '练强', avatar: 'http://static.myseu.cn/2018-05-22-153319.png' },
        { id: 6, name: '俞安澜', avatar: 'http://static.myseu.cn/2018-05-22-153401.png' },
        { id: 7, name: '王楠', avatar: 'http://static.myseu.cn/2018-05-22-153417.png' },
        { id: 8, name: '朱显明', avatar: 'http://static.myseu.cn/2018-05-22-153438.png' },
        { id: 9, name: '徐希庆', avatar: 'http://static.myseu.cn/2018-05-22-153510.png' },
        { id: 10, name: '李沛文', avatar: 'http://static.myseu.cn/2018-05-22-153521.png' },
        { id: 11, name: '傅金鑫', avatar: 'http://static.myseu.cn/2018-05-22-153533.png' },
        { id: 12, name: '俞涛', avatar: 'http://static.myseu.cn/2018-05-22-153555.png' },
        { id: 13, name: '杨宇峰', avatar: 'http://static.myseu.cn/2018-05-22-153610.png' },
        { id: 14, name: '张霁扬', avatar: 'http://static.myseu.cn/2018-05-22-153620.png' },
        { id: 15, name: '唐昆', avatar: 'http://static.myseu.cn/2018-05-22-153631.png' },
        { id: 16, name: '郝运', avatar: 'http://static.myseu.cn/2018-05-22-153647.png' },
        { id: 17, name: '金鼎鑫', avatar: 'http://static.myseu.cn/2018-05-22-153701.png' },
        { id: 18, name: '傅瑞盈', avatar: 'http://static.myseu.cn/2018-05-22-153715.png' },
        { id: 19, name: '黄梦宇', avatar: 'http://static.myseu.cn/2018-05-22-153728.png' },
        { id: 20, name: '冯筱扬', avatar: 'http://static.myseu.cn/2018-05-22-153739.png' }
      ].map(k => Object.assign(k, {
        total: 0,
        normalTotal: 0,
        specialTotal: 0
      })),
      pendingCandidates: [],
      duration: 15000
    }
  },
  async created() {
    document.body.ondragleave = e => e.preventDefault()
    document.body.ondrop = async e => {
      e.stopPropagation()
      e.preventDefault()
      let file = e.dataTransfer.files[0]
      let reader = new FileReader()
      reader.onload = e => {
        let data = e.target.result
        let workbook = XLSX.read(data, { type: 'binary' })

        let csv = XLSX.utils.sheet_to_csv(workbook.Sheets.Sheet1)
        csv = csv.split('\n').filter(k => /^.+(,.+){4}$/.test(k)).slice(1).map(k => {
          let [ id, name, total, specialTotal, normalTotal ] = k.split(',')
          id = parseInt(id)
          total = parseFloat(total)
          normalTotal = parseFloat(normalTotal)
          specialTotal = parseFloat(specialTotal)
          return { id, name, total, specialTotal, normalTotal }
        }).sort((a, b) => a.id - b.id).slice(0, 20).map((k, i) => Object.assign(this.candidates[i], k))
        
        this.load({ candidate: csv })
      }
      reader.readAsBinaryString(file)
    }
    document.body.ondragenter = e => e.preventDefault()
    document.body.ondragover = e => e.preventDefault()
  },
  computed: {
    maxTotal() {
      return this.candidates.map(k => Number(k.total)).reduce((a, b) => a > b ? a : b, 1)
    }
  },
  methods: {
    async load(data) {
      let { candidate } = data
      this.pendingCandidates = candidate
      this.candidates = JSON.parse(JSON.stringify(candidate)).map(k => {
        k.normalTotal = 0
        k.specialTotal = 0
        k.total = 0
        return k
      })
      setTimeout(() => {
        this.candidates = this.pendingCandidates
        setTimeout(() => {
          this.pendingCandidates = null
          this.candidates.sort((a, b) => b.total - a.total)
        }, this.duration)
      }, 1000)
    }
  }
})