const {profile,works}=require('../../content');
Page({data:{profile,works},onShareAppMessage(){return {title:'陈嘉玮 · 精选作品集',path:'/pages/index/index',imageUrl:works[0].poster};}});
