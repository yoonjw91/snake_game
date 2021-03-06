snake_module = {
    snake : [],
    head : $('<div />').css({position: "absolute", border: "1px solid red", width: "23px", height: "23px", backgroundColor: "black"}),
    tail : $('<div />').css({position: "absolute", border: "1px solid red", width: "23px", height: "23px"}),
    food : [],
    pray : $('<div />').css({position: "absolute", border: "1px solid black", width: "23px", height: "23px", backgroundColor: "black"}),
    init_direction : "right",
    change_direction : "right",
    distance : 25,
    movement : 1,
    stopwatch : null,
    moving_snake : null,
    status : true,
    score : 0,
    min : 0,
    sec : 0,
    ms : 0,
    interval : 500,
    set_map : function(){
        var snake = this.snake;
        var init_direction = this.init_direction;
        var change_direction = this.change_direction;
        var distance = this.distance;

        snake.push({html: this.head, position : {x: 3, y: 0}});
        snake.push({html: this.tail.clone(true), position : {x: 2, y: 0}});
        snake.push({html: this.tail.clone(true), position : {x: 1, y: 0}});

        for(var i = 0; i < snake.length; i++){
            $('#map').append(snake[i].html.css({'top': snake[i].position.y * distance, 'left' : snake[i].position.x * distance}));
        }
    },
    reset_map : function(){
        $('#map').empty();
        this.snake.splice(0,this.snake.length);
        this.set_map();
        this.make_food();
        this.status = true;
        this.score = 0;
        $('.game_score').text(this.score);
    },
    set_time : function(){
        var time = "";

        this.stopwatch = setInterval(function(){
            snake_module.ms++;

            if(snake_module.ms >= 100){
                snake_module.sec++;
                snake_module.ms = 0;
                if(snake_module.sec >= 60){
                    snake_module.min++;
                    snake_module.sec = 0;
                }
            }

            time = (snake_module.min > 9 ? snake_module.min : "0" + snake_module.min) + ":" 
                    + (snake_module.sec > 9 ? snake_module.sec : "0" + snake_module.sec) + ":" 
                    + (snake_module.ms > 9 ? snake_module.ms : "0" + snake_module.ms);

            $('.stopwatch').text(time);
        },10);

    },
    stop_time : function(){
        clearInterval(this.stopwatch);
    },
    reset_time : function(){
        $('.stopwatch').text("00:00:00");
        this.ms = 0; this.sec = 0; this.min = 0;
    },
    init_game : function(){
        var snake = this.snake;
        var init_direction = this.init_direction;
        var change_direction = this.change_direction;
        var distance = this.distance;

        $(document).on("keydown", function(e){// left: 37, up: 38, right: 39, down: 40;
            if(e.keyCode == 37){
                change_direction = "left";
            }else if(e.keyCode == 39){
                change_direction = "right";
            }else if(e.keyCode == 40){
                change_direction = "bottom";
            }else if(e.keyCode == 38){
                change_direction = "top";
            }
            console.log(change_direction);
        });

        this.moving_snake = setInterval(function(){
            //change_direction = module.check_direction(init_direction, change_direction);
            //module.check_direction(init_direction, change_direction);

            var movement = snake_module.set_movement(change_direction);

            snake_module.check_status(movement, change_direction);

            if(eval(snake_module.status)){
                for(var i = snake.length - 1; i > -1; i--){
                    snake[i].html.css({"top": snake[i].position.y*distance, "left": snake[i].position.x*distance});
                }
            }else{
                snake_module.stop_game();
                snake_module.stop_time();
                var user_pick = confirm('Game Over\nWanna try again?');
                if (user_pick == true) {
                    snake_module.reset_map();
                    snake_module.reset_time();
                }
            }

            init_direction = change_direction;
        }, this.interval);

    },
    stop_game : function(){
        clearInterval(this.moving_snake);
    },
    check_direction : function(init_direction, change_direction){
        if(init_direction != change_direction){
            switch(init_direction){
                case "top":
                    if(change_direction == "bottom") change_direction = "top";
                    break;
                case "bottom":
                    if(change_direction == "top") change_direction = "bottom";
                    break;
                case "left":
                    if(change_direction == "right") change_direction = "left";
                    break;
                case "right":
                    if(change_direction == "left") change_direction = "right";
                    break;
            }
        }

        //return change_direction;
    },

    make_food : function(){
        var snake = this.snake;
        var food = this.food;
        var pray = this.pray;
        var distance = this.distance;
        var x = Math.floor(Math.random()*10);
        var y = Math.floor(Math.random()*10);

        if(food.length > 0){
            food[0].html.css('display','none');
            food.splice(0,1);
        }

        for(var i = 0; i < snake.length; i++){
            if(snake[i].position.x == x && snake[i].position.y == y){
                x = Math.floor(Math.random()*10);
                y = Math.floor(Math.random()*10);
                i = -1;
            }
        }

        food.push({html: pray.clone(true), position: {x: x, y: y}});
        $('#map').append(food[0].html.css({'top': food[0].position.y*distance, 'left': food[0].position.x*distance}));

    },

    set_movement : function(change_direction){
        if(change_direction == "top" || change_direction == "left"){
            return -1;
        }else return 1;
    },

    check_status : function(movement, change_direction){
        var snake = this.snake;
        var head = snake[0];
        var food = this.food;
        var pray = food[0];
        var prev_x = snake[snake.length-1].position.x;
        var prev_y = snake[snake.length-1].position.y;

        for(var i = snake.length - 1; i > -1; i--){
            if(i == 0){
                if(change_direction == "left" || change_direction == "right"){
                    snake[i].position.x += movement;
                }else if(change_direction == "top" || change_direction == "bottom"){
                    snake[i].position.y += movement;
                }
            }else{
                snake[i].position.x = snake[i-1].position.x;
                snake[i].position.y = snake[i-1].position.y;
            }
        }

        //for(var i = 0; i < food.length; i++){
            if(head.position.x == pray.position.x && head.position.y == pray.position.y){
                this.score += 50;
                this.add_tail(prev_x, prev_y);                        
                this.make_food();
                $('.game_score').text(this.score);
                //alert('snake ate pray');
            }
        //}

        if(head.position.x < 0 || head.position.x > 29 || head.position.y < 0 || head.position.y > 29){
            this.status = false;
        }

        /*for(var i = 1; i < snake.length; i++){
            if(head.position.x == snake[i].position.x && head.position.y == snake[i].position.y){                        
                this.status = false;       
            }
        }*/

        if(eval(this.hit_event(snake, head.position))) this.status = false;
    },

    add_tail : function(prev_x, prev_y){
        var snake = this.snake;

        snake.push({html: this.tail.clone(true), position: {x: prev_x, y: prev_y}});
        $('#map').append(snake[snake.length-1].html);
    },

    hit_event : function(arr, val) {
        var snake = $.extend([], arr);
        var body = snake.splice(1,snake.length-1);
        return body.some(function(arrVal) {
          return (val.x === arrVal.position.x && val.y === arrVal.position.y);
        });
    },

}

$(document).ready(function(){
    snake_module.set_map();
    snake_module.make_food();
    $('.game_score').text(snake_module.score);
    $('.stopwatch').text("00:00:00");

    $('.startBtn').on('click', function(){
        var user_pick = confirm('게임을 시작하시겠습니까?');
        if(user_pick == true){
            snake_module.init_game();
            snake_module.set_time();
        }
    });

    $('.pauseBtn').on('click', function(){
        snake_module.stop_game();
        snake_module.stop_time();
    });
 });