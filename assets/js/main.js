const $ =document.querySelector.bind(document);
const $$ =document.querySelectorAll.bind(document);


const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd =$('.cd');
const playBtn = $('.btn-toggle-play');
const player= $('.player');
const progress=$('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn= $('.btn-random')
const repeatBtn = $('.btn-repeat')
const app={
    currentIndex: 0,
    isplaying: false,
    isRepeat: false,
    songs:  [
        {
            name: 'Em không quay về',
            singer:'Hoàng Tôn',
            path: './assets/music/ekqv.mp3',
            image: './assets/img/h4.png'
        },
        {
            name: 'Giá như ngày đó',
            singer:'Chin ft. VKT x Dino',
            path: './assets/music/gnnd.mp3',
            image: './assets/img/h2.png'
        },        
        {
            name: 'Hạ tàn',
            singer:'Minn ft. Bon',
            path: './assets/music/ht.mp3',
            image: './assets/img/h5.png'
        },        
        {
            name: 'Sau chia tay',
            singer:'T.R.I',
            path: './assets/music/sct.mp3',
            image: './assets/img/h6.png'
        },        
        {
            name: 'Tự làm mình đau',
            singer:'Đào Duy Quý',
            path: './assets/music/tlmd.mp3',
            image: './assets/img/h7.png'
        },        
        {
            name: '10 ngàn năm',
            singer:'PC',
            path: './assets/music/10.mp3',
            image: './assets/img/h1.png'
        },
        {
            name: 'Sắp 30',
            singer:'Trịnh Đình Quang',
            path: './assets/music/sap30.mp3',
            image: './assets/img/h3.png'
        }
    ],
    render: function(){
        const htmls =this.songs.map(function(song,index){
            return `
                    <div class="song ${index=== app.currentIndex ?'active':''}"data-index=${index} >
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        document.querySelector('.playlist').innerHTML=htmls.join('');
    },
    definePropertys: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents:function(){
        const _this=this;
        const cdwidth=cd.offsetWidth;

        // xử lý cd quay / dừng

        const cdThumbAnimate= cdThumb.animate([
            {transform: 'rotate(360deg)'}

        ],{
            duration: 10000,
            iterations:Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ cd
        document.onscroll=function(){
            const scrollTop= window.scrollY|| document.documentElement.scrollTop;
            const newCdWidth=cdwidth-scrollTop;

            cd.style.width= newCdWidth>0 ? newCdWidth+'px':0;
            cd.style.opacity= newCdWidth/cdwidth;
        }
        // xử lý click play
        playBtn.onclick=function(){
            if(_this.isplaying)
            {
                audio.pause();
            }else
            {
                audio.play();
            }
            // bắt sự kiện play
            audio.onplay=function(){
                _this.isplaying=true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            // bắt sự kiện pause
            audio.onpause=function(){
                _this.isplaying=false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }
            // khi tiến độ bài hát thay đổi
            audio.ontimeupdate=function(){
                if(audio.duration)
                {
                    const progressPercent=Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value=progressPercent;
                }
            }

        }
        // Tua bài hát
        progress.onchange=function(e){
            const seekTime =audio.duration /100 * e.target.value;
            audio.currentTime=seekTime;
        }
        //next bài hát
        nextBtn.onclick=function(){
            _this.nextSong();
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
            
        }
        // prev bài hát
        prevBtn.onclick=function(){
            _this.prevSong();
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // tự chuyển bài
        audio.onended=function(){
            if (_this.isRepeat) {
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        // lặp lại 1 bài
        repeatBtn.onclick=function(){
            _this.isRepeat =!_this.isRepeat;
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }

        $('.playlist').onclick=function(e){
            if(e.target.closest('.song:not(.active)' || e.target.closest('.option')))
            {
                if(e.target.closest('.song:not(.active)'))
                {
                    _this.currentIndex=Number(e.target.closest('.song:not(.active)').dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                    
                }
            }
            
    
        }
    },

    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest',
            })
        },300)
    },
    loadCurrentSong:function(){
        heading.textContent=this.currentSong.name;
        cdThumb.style.background= `url('${this.currentSong.image}')`;
        audio.src=this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length)
        {
            this.currentIndex=0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex <0)
        {
            this.currentIndex=this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    start: function(){
        // Định nghĩa các thuộc tính object
        this.definePropertys();

        this.handleEvents();

        this.loadCurrentSong();

        this.render();

    }
}

app.start();