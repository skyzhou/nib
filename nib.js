var NIB={
	env:{
		inner:false,
		user:'',
		type:1//0 - 添加笔记 1 - 翻译
	},
	els:{
		body:document.body||document.getElementsByTagName('body')[0]
	},
	text:'',
	$:function(i){
		return document.getElementById(i);
	}
};
/**
 *@description 初始化环境 
 */
NIB.init=function(){
	var that=this;
	
	//初始化环境
	chrome.extension.sendRequest({action:'init'},function(json){
		//设置样式
		that.insertStyle(json.style);
		
		//创建页面节点 nib
		var nib=document.createElement('div');
		nib.id='nib-wrap';
		nib.innerHTML=json.html;
		that.els.body.appendChild(nib);
		
		
		//后续需要操作的节点存储
		that.els.btn=that.$('nib-btn')
		that.els.editor=that.$('nib-editor');
		that.els.nib=nib;
		that.els.panel=that.$('nib-panel');
		that.els.loading=that.$('nib-loading');
		
		that.env.user=json.user;
		json.user&&(that.$('nib-title').innerHTML=json.user.split('|')[0]);
		
		//判断当前操作是在nib内还是nib外
		nib.addEventListener('mouseover',function(evt){
			that.env.inner=true;
		},false);
		nib.addEventListener('mouseout',function(evt){
			that.env.inner=false;
		},false);
		
		//点击界面小图标 如果长度小于N而且是英文，则翻译，否则视为添加笔记操作
		that.els.btn.addEventListener('click',function(evt){
			chrome.extension.sendRequest({action:'ask'},function(answer){
				that.els.panel.style.display="block";
				//如果两边用户状态不同步
				if(that.env.user!=answer){
					that.els.loading.style.display="block";
					that.els.loading.innerHTML="你切换了用户，请刷新页面";
					return;
				}
				else{
					if(!json.user){
						return;
					}
					
					var text=that.text;
					that.env.type=1;
					if(text.length<30&&/^[A-Za-z]+$/.test(text)){
						that.els.loading.style.display="block";
						that.env.type=2;
						chrome.extension.sendRequest({action:'tran',text:that.text},function(ret){
							that.els.editor.innerHTML=ret;
							that.els.loading.style.display="none";
						});
					}
					else{
						that.els.editor.innerHTML=that.text;
					}
				}
			});
			
			
			
		},false);
		
		//添加笔记操作
		that.$('nib-add-btn').addEventListener('click',function(evt){
			chrome.extension.sendRequest({action:'mark',text:that.els.editor.innerHTML,url:window.location.href,type:that.env.type},function(){
				//
			});
			that.showAddBtn();
		},false);
	});

	
	var body=that.els.body;
	
	body&&body.addEventListener('mouseup',function(evt){
		if(that.env.inner){
			return;
		}
		that.els.panel.style.display="none";
		
		var text=window.getSelection().toString().replace(/\r?\n/g,'<br />').replace(/^\s*(\S[\s\S]*\S)\s*$/,function(a,b){
			return b;
		});
		if(text){
			that.text=text;
			that.showAddBtn(evt.pageX,evt.pageY);
		}
		else{
			that.showAddBtn();
		}
	},false);
}
/**
 *@description 插入样式 
 */
NIB.insertStyle=function(style){
	var head=document.getElementsByTagName('head')[0];
		node=document.createElement('style');
	node.type="text/css";
	node.appendChild(document.createTextNode(style));
	head&&head.appendChild(node);

}
/**
 *@description 显示添加按钮 
 */
NIB.showAddBtn=function(x,y){
	x=x||-500;
	y=y||-500;
	var nib=this.els.nib;
	nib.style.left=x-27+'px';
	nib.style.top=y-45+'px';
}

NIB.init();

