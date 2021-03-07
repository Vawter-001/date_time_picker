// components/date_time_picker/date_time_picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    step:{//预约时间的步长，设置为30，选项就是1小时内的00分和30分；  设置为10，就是00分、10分、20分、30分、……50分
      type:Number
    },
    range:{//可预约的日期范围。默认日期从今天开始，到第range天后为止，这里设为10天
      type:Number,
      value:10
    },
    start_time:{//每天最早时间，设为07:59，则可以从08:00开始预约
      type:String,
      value:'07:59'
    },
    end_time:{//每天最晚预约时间
      type:String,
      value:'21:00'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    date_time:[[1],[1]],
    date_time_index_array:[0,0]
  },
  attached(){
    let today=this.ts_string(  new Date().getTime()   )
    let day_10=this.ts_string(   new Date().setDate(new Date().getDate() + this.data.range)   )

    let date_column=this.getDiffDate(today,day_10)
    let time_column=this.get_stepped_time(today,today,this.data.step)
    this.setData({
      date_time:[date_column,time_column],
      date_column,
      time_column,
      today,
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //getDiffData和zfill、ts_string一起构成：获取一段时间之内的日期列表功能
    ///调用getDiffData，传入参数：2020-03-01，2020-03-03，返回，['2020-03-01','2020-03-02','2020-03-03']
    getDiffDate(start, end) {
      var startTime =new Date(start);
      var endTime =new Date(end);
      var dateArr = [];
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
        dateArr.push(   this.ts_string(startTime.getTime())   );
        startTime.setDate(startTime.getDate() + 1);
      }
      return dateArr;
    },
    zfill(num, length){
      return (Array(length).join('0') + num).slice(-length);
    },
    ts_string(timestamp) {
      let d=new Date(timestamp);
      let string=(d.getFullYear())+"-"+
        this.zfill((d.getMonth()+1),2)+"-"+
        this.zfill((d.getDate()),2)
      return string
    },

    //get_stepped_time/get_start_time/get_time一起构成预约时间的选择
    //get_stepped_time的date是预约日期，today是今天日期，step是预约步长
    get_stepped_time(date,today,step){
      let start_time;
      if(date==today){
        start_time=this.get_start_time(  new Date().getTime()  )
      }
      else{
        start_time=this.get_start_time(  new Date('2020-01-01 '+this.data.start_time).getTime()  )
      }
      start_time=new Date('2020-01-01 '+start_time);
      let end_time=new Date('2020-01-01 '+this.data.end_time);

      let time_column=[];
      while ((end_time.getTime() - start_time.getTime()) >= 0) {
        let d=this.get_time(start_time.getTime())
        let t=d.split(":")
        if(parseInt(t[1])%step===0){
          time_column.push(d)
        }
        start_time.setMinutes(start_time.getMinutes()+1);
      }
      return time_column
    },
    get_start_time(timestamp){
      let d=new Date(timestamp);
      if(  d.getMinutes()>=30 ){
        if(d.getHours()===23){
          return "00:00"
        }
        else{
          return this.zfill((d.getHours()+1),2)+":00"
        }
      }
      else{
        return this.zfill((d.getHours()),2)+":30"
      }
    },
    get_time(timestamp){
      let d=new Date(timestamp);
      let string=
        this.zfill((d.getHours()),2)+":"+
        this.zfill((d.getMinutes()),2)
      //console.log("string",string)
      return string
    },

    //改变列时更改date_time_index_array
    date_time_change(e){
      this.setData({
        date_time_index_array:e.detail.value
      })
      this.triggerEvent('get_value',{value:this.data.date_time[0][this.data.date_time_index_array[0]]+" "+this.data.date_time[1][this.data.date_time_index_array[1]]})
    },
    //改变日期列时，重新计算时间列
    date_time_column_change(e){
      if(e.detail.column===0){
        let day=this.data.date_time[e.detail.column][e.detail.value]
        let time_column=this.get_stepped_time(day,this.data.today,this.data.step)
        this.setData({
          date_time:[this.data.date_column,time_column],
          time_column,
        })
      }
    },
  },


})
