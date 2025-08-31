
window.onload = function(){
    var canvas = document.getElementById("platform");
    var context = canvas.getContext("2d");
    var xCenter = 500/2, yCenter=500/2;

    var body = document.getElementById("body");

    var t = Date.now();
    var x=0,y=0,vx=200,vy=100;
    var radius=10;
    var isBouncingX = false, isBouncingBarY = false, isBouncingBarX=false;

    var xP=0,w=70;
    const yP=220,vxp=220,h=5;

    var xb=0,wb=70;
    const yb=-220,vxb=220,hb=5;

    var a=0,b=0;
    var versusBot=0;
    var botrange = 30;

    var input =0;
    var inputb =0;
    document.addEventListener("keydown",function(event){
        if(event.key==="ArrowRight"){
            input = 1;
        }else if(event.key==="ArrowLeft"){
            input =-1;
        }
    });
    document.addEventListener("keyup",function(event){
        if((event.key==="ArrowRight"&&input==1) || (event.key==="ArrowLeft"&&input==-1)){
            input=0;
        }
    });

    if(versusBot==1){
        document.addEventListener("keydown",function(event){
            if(event.key==="d"){
                inputb = 1;
            }else if(event.key==="a"){
                inputb =-1;
            }
        });
        document.addEventListener("keyup",function(event){
            if((event.key==="d"&&inputb==1) || (event.key==="a"&&inputb==-1)){
                inputb=0;
            }
        });
    }

    var startGame = false;
    document.addEventListener("keydown",function(event){
        if(event.key==="d" || event.key==="a" || event.key==="ArrowRight" || event.key==="ArrowLeft"){
            startGame = true;
        }
    });


    function DrawBall(x,y){
        context.beginPath();
        context.arc(x+xCenter,y+yCenter,radius,0,2*Math.PI);
        context.fillStyle = "tomato";
        context.fill();
    }

    function BallPhysics(x,y,t,vx,vy){
        var deltax = Math.abs(vx*t);
        var deltay = Math.abs(vy*t);
        x+=vx*t;
        y+=vy*t;
        // console.log(Math.abs((xCenter+x)-radius));
        if((Math.abs((xCenter-x)-radius)<=deltax || Math.abs((xCenter+x)-radius)<=deltax)&&isBouncingX==false){
            vx*=-1;
            isBouncingX=true;
        }else{
            isBouncingX=false;
        }
        if(x>=xP-w/2-radius-deltax && x<=xP+w/2+radius+deltax){
            // console.log("ok");
            // console.log(Math.abs((yP-y)-radius));
            if((Math.abs((yP-y)-radius)<=deltay) && isBouncingBarY==false){
                vy*=-1
                isBouncingBarY=true;
            }
            else{
                isBouncingBarY=false;
            }
        }
        if(y>=yP-radius-deltay && y<=yP+h){
            if((Math.abs((xP-w/2-x)-radius)<=deltax)&&isBouncingBarX==false){
                vx=-1*vxp;
                isBouncingBarX=true;
            }else if((Math.abs((x-xP-w/2)-radius)<=deltax)&&isBouncingBarX==false){
                vx=vxp;
                isBouncingBarX=true;
            }else{
                isBouncingBarX=false;
            }
        }

        if(x>=xb-wb/2-radius-deltax && x<=xb+wb/2+radius+deltax){
            // console.log("ok");
            // console.log(Math.abs((yP-y)-radius));
            if((Math.abs((y-(yb+hb))-radius)<=deltay) && isBouncingBarY==false){
                vy*=-1
                isBouncingBarY=true;
            }
            else{
                isBouncingBarY=false;
            }
        }
        if(y>=yb+hb && y<=yb+hb+radius+deltay){
            if((Math.abs((xb-wb/2-x)-radius)<=deltax)&&isBouncingBarX==false){
                vx=-1*vxb;
                isBouncingBarX=true;
            }else if((Math.abs((x-xb-wb/2)-radius)<=deltax)&&isBouncingBarX==false){
                vx=vxb;
                isBouncingBarX=true;
            }else{
                isBouncingBarX=false;
            }
        }

        DrawBall(x,y);
        // console.log(vy);
        // console.log(vx);
        return [x,y,vx,vy];
    }

    function DrawPlayer(x,y,w,h){
        context.beginPath();
        context.rect(x+xCenter-w/2,y+yCenter,w,h);
        context.fillStyle = "white";
        context.fill();
    }

    function PlayerControl(x,y,vx,w,h,input,t){
        var deltax = Math.abs(vx*t);
        if(!((Math.abs((xCenter-x)-w/2)<=deltax && input==1)|| (Math.abs((xCenter+x)-w/2)<=deltax && input==-1))){
            x+=input*vx*t;
        }
        DrawPlayer(x,y,w,h);
        return x;
    }

    function game(){
        var time = (Date.now()-t)/1000;
        t = Date.now();
        if(startGame==true){
            context.clearRect(0,0,xCenter*2,yCenter*2);
            
            [x,y,vx,vy]=BallPhysics(x,y,time,vx,vy);

            //Player
            // DrawPlayer(xp,yp,w,h);

            console.log(xb,yb,vxb);
            
            
            xP=PlayerControl(xP,yP,vxp,w,h,input, time);

            if(versusBot==1){
                if(y<(-1)*yCenter+botrange && vy<0){
                    if(x<xb){
                        inputb=-1;
                    }else if(x>xb){
                        inputb=1;
                    }else{
                        inputb=0;
                    }
                }else{
                    inputb=0;
                }
            }
            xb = PlayerControl(xb,yb,vxb,wb,hb,inputb,time);
        }

        if(y-radius>yCenter){
            a+=1;
            console.log("Round over: ",a,"-",b);
            if(a!=3)resetRound();
        }else if(y+radius<-1*yCenter){
            b+=1;
            console.log("Round over: ",a,"-",b);
            if(b!=3)resetRound();
        }

        if(a==3){
            console.log("Player 1 won!");
        }else if(b==3){
            console.log("Player 2 won!");
        }else{
            window.requestAnimationFrame(game);
        }
    }

    function resetRound() {
        x = 0; y = 0;
        var factor=1;
        if(Math.random()>=0.5){
            factor=-1;
        }

        vx = (200 + (Math.random()*20))*factor; 

        factor=1;
        if(Math.random()>=0.5){
            factor=-1;
        }
        vy = (100 + (Math.random()*20))*factor;

        xP = 0;
        xb = 0;

        context.clearRect(0,0,xCenter*2,yCenter*2);
        DrawBall(x,y);
        DrawPlayer(xP,yP,w,h);
        DrawPlayer(xb,yb,wb,hb);

        startGame=false;
    }

    function Player2v2(){
        versusBot=0;
        console.log("Game starts: 0-0");
        a = 0; b = 0;
        resetRound();
        game();
    }

    function PlayervBot(level){
        versusBot=1;
        console.log("Game starts: 0-0");
        a = 0; b = 0; botrange=150;
        switch (level){
            case 1:
                botrange=150;
                break;
            case 2:
                botrange=165;
                break;
            case 3:
                botrange=280;
                break;
        }
        resetRound();
        game();
    }

    PlayervBot(2);
};