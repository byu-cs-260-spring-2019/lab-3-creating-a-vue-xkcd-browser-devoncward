Vue.component('star-rating', VueStarRating.default);
let app = new Vue({
  el: '#app',
  data: {
    number: '',
    max: '',
    current: {
      title: '',
      img: '',
      alt: ''
    },
    addedName: '',
    addedComment: '',
    comments: {},
    ratings: {},
    //current: {},
    //This will also work because once we assign the current object, we
    //can access its elements directly, like in HTML line 20
    loading: true,
  },
  //Created is very similar to mounted
  created() {
    this.xkcd();
  },
  methods: {
    async xkcd() {
      try {
        this.loading = true;
        const response = await axios.get('https://xkcd.now.sh/' + this.number);
        console.log("Response: ", response);
        this.current = response.data;
        this.loading = false;
        this.number = response.data.num;
      } catch (error) {
        this.number = this.max;
        console.log(error);
      }
    },
    previousComic() {
      console.log(this.current.num);
      this.number = this.current.num - 1;
      if (this.number < 1) {
        this.number = 1;
      }
      console.log("Previous number now: ", this.number);
    },
    nextComic() {
      console.log("Entering next commic");
      this.number = this.current.num + 1;
      if (this.number > this.max) {
        this.number = this.max;
      }
    },
    getRandom(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
    },
    randomComic() {
      console.log("Entering random commic");
      this.number = this.getRandom(1, this.max);
    },
    addComment() {
      if (!(this.number in this.comments))
        Vue.set(app.comments, this.number, new Array);
      this.comments[this.number].push({
        author: this.addedName,
        text: this.addedComment,
        time: moment().format('LLLL'), // Tuesday, May 21, 2019 2:16 PM
      });
      this.addedName = '';
      this.addedComment = '';
    },
    firstComic() {
      console.log("Entering first commic");
      this.number = 1;
    },
    lastComic() {
      console.log("Entering last commic");
      this.number = this.max;
    },
    setRating(rating) {
      if (!(this.number in this.ratings))
        Vue.set(this.ratings, this.number, {
          sum: 0,
          total: 0,
          average: 0,
        });
      this.ratings[this.number].sum += rating;
      this.ratings[this.number].total += 1;
      //this.averageRating = this.ratings[this.number].sum/this.ratings[this.number].total;
      this.ratings[this.number].average = this.ratings[this.number].sum/this.ratings[this.number].total;
    },
  },
  computed: {
    //Month function makes the given month look prettier
    month() {
      var month = new Array;
      if (this.current.month === undefined)
        return '';
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      return month[this.current.month - 1];
    },
    computeAverage() {
      averageRating = '';
      if(this.number in this.ratings) {
        averageRating = this.ratings[this.number].sum/this.ratings[this.number].total;
      } else {
        averageRating = 0;
      }
      return averageRating;
    },
  },
  //Watch is called because it is watching the function to see if anything
  //inside the function changes, then it will run
  watch: {
    number(value, oldvalue) {
      if (oldvalue === '') {
        this.max = value;
      } else {
        this.xkcd();
      }
    },
  },
});
