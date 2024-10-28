const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: '',

    id: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScP2KRmFnVP9ZqwnqXbBNro0yGPHh8y1uy39uAi2LJaV_CKdA/formResponse',
    
    // Google Form 各個 input 的 name
    input: {
      ID: 'entry.1486848017',
      ID2: 'entry.44110693',
      ID3: 'entry.1140389923',
      ID4: 'entry.383006796',
      ID5: 'entry.1695976022',
    },

    // loading 效果要不要顯示
    loading: false
  },
  methods: {
    // ID 限填 4 碼
    limitIdLen(val) {
      if(val.length > 4) {
        return this.id =  this.id.slice(0, 4);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.name !== undefined) {
        let params = `${this.input.ID}=${this.person.ID}&${this.input.ID2}=${this.person.ID2}&${this.input.ID3}=${this.person.ID3}&${this.input.ID4}=${this.person.ID4}&${this.input.ID5}=${this.person.ID5} || '無'}`;
        fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功。');
            this.id = '';
            this.person = {};
          })
      }
    }
  },
  watch: {
    id: function(val) {
      // ID 輸入到 4 碼就查詢資料
      if(val.length === 4) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.id] === undefined) {
          this.loading = true;
          let uri = this.gas + '?id=' + this.id;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => {
              this.persons[this.id] = res; // 把這次查詢的 id 結果存下來
              this.person = res;
              this.loading = false;
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.id];
        }

      }
    }
  }
})
