//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//TODO:
//      -bfs: geht durch obstruction durch muss behoben werden
//      -animation: will nicht wirklich der canvas wird nach abschluss der ganzen berechnung neu gezeichnet
//          ->kann mit einer eigenen draw-function behoben werden die mit setInterval zusammenarbeiten
//      -dfs: komplett
//      
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------


let canvas = document.getElementById("grid_canvas")
let ctx = canvas.getContext("2d")
let grid_width = 100
let nav_height = 47
let max_width = window.innerWidth - (window.innerWidth  % grid_width)
let max_height = window.innerHeight - nav_height - ((window.innerHeight - nav_height) % grid_width)
let obstruction_color = "green"
let start_point_color = "red"
let end_point_color = "blue"
let start_point_already_set = false
let startpoint = new Array()
let end_point_already_set = false
let field_id_counter = 0
console.log(window.innerHeight)
console.log(window.innerWidth)
console.log(window.innerHeight % grid_width)
console.log(window.innerWidth % grid_width)
let painting = false
canvas.height = max_height
canvas.width = max_width


//finished and tested
function start_drawing_obstruction(){
    painting = true
}
//finished and tested
function stop_drawing_obstruction(){
    painting = false
}
//finished and tested
function draw_obstruction(e){
    if(!painting){
        return
    }
    console.log(e.clientX, e.clientY)
    console.log(fields)
    posX = (e.clientX  - (e.clientX % grid_width)) / grid_width
    posY = (e.clientY  - nav_height - ((e.clientY - nav_height) % grid_width)) / grid_width
    fields[posY][posX].obstruction = true
    fields[posY][posX].color = obstruction_color
    fields[posY][posX].draw(ctx)
    

}
//finished and tested
function drawGrid(X, Y, grid_width, color){
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.fillRect(X, Y, grid_width, grid_width)
    ctx.stroke()
    ctx.closePath()
}
//finished and testd
function set_nav_height(){
    nav = document.querySelector(".navbar")
    nav_height = nav.clientHeight
}
//finished and tested
function set_start_and_end_point(e){
    if(start_point_already_set && end_point_already_set) {
        return
    }
    if(start_point_already_set && !end_point_already_set){
        posX = (e.clientX  - (e.clientX % grid_width)) / grid_width
        posY = (e.clientY  - nav_height - ((e.clientY - nav_height) % grid_width)) / grid_width

        fields[posY][posX].end_point = true
        fields[posY][posX].color = end_point_color
        fields[posY][posX].draw(ctx)
        //drawGrid(posX, posY, grid_width, end_point_color)
        end_point_already_set = true
    }
    if(!start_point_already_set && !end_point_already_set){
        posX = (e.clientX  - (e.clientX % grid_width)) / grid_width
        posY = (e.clientY  - nav_height - ((e.clientY - nav_height) % grid_width)) / grid_width
        console.log("posX")
        console.log(posX)
        console.log(posY)
        fields[posY][posX].start_point = true
        fields[posY][posX].color = start_point_color
        fields[posY][posX].draw(ctx)
        startpoint = [posY,posX]
        start_point_already_set = true
    }
}
//finished
class Field{
    constructor(x_pos, y_pos, color){
        this.x_pos = x_pos
        this.y_pos = y_pos
        this.color = color
        this.id = field_id_counter++
        this.start_point = false
        this.end_point = false
        this.obstruction = false
        this.visited = false
    }
    draw(context){

        context.fillStyle = this.color
        context.strokeStyle ="#55555555"
        context.fillRect(this.x_pos, this.y_pos, grid_width, grid_width)
        context.strokeRect(this.x_pos, this.y_pos, grid_width, grid_width)
        
    }
}
//------------------------------------------------------------------
//geht irgendwie schief kann aber auch an der neighbour queue kombi liegen die in bfs verwendet wird
function check_if_field_is_obstrruction(fields, list){
    for(i = 0; i < list.length; i++){
        k = list[i][0]
        l = list[i][1]
        if(fields[k][l].obstruction){
            list.splice(i, 1)
        }
    }
    return list
}
//finished and tested
//top-bottom-left-to-right
function get_neighbours(fields, i, j){
    if(i == 0){
        if(j == 0){
            return [[i + 1, j], [i, j + 1]]
        }
        else if(j == fields[0].length - 1){
            return [[i, j - 1], [i + 1, j]]
        }
        else{
            return [[i, j - 1], [i + 1, j], [i, j + 1]]
        }
    }
    else if(i == fields.length - 1){
        if(j == 0){
            return [[i - 1, j], [i, j + 1]]
        }
        else if(j == fields[0].length - 1){
            return [[i, j - 1], [i - 1, j]]
        }
        else{
            return [[i, j - 1], [i - 1, j], [i, j + 1]]
        }
    }
    else{
        if(j == 0){
            return [[i - 1, j], [i, j + 1], [i + 1, j]]
        }
        else if(j == fields[0].length - 1){
            return [[i, j - 1], [i - 1, j], [i + 1, j]]
        }
        else{
            return [[i, j - 1], [i - 1, j], [i, j + 1], [i+1, j]]
        }

    }

}

var wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}


//-----------------------------------------------------------------------------
function bfs(fields, startpoint){
    let animation_queue = new Array()
    var i = startpoint[0]
    var j = startpoint[1]
    var queue = [[i,j]]
    animation_queue = [[i,j]]
    do{
        next = queue[0]
        i = next[0]
        j = next[1]
        
        queue = queue.slice(1)
        neighbours = get_neighbours(fields, i, j)
        neighbours = check_if_field_is_obstrruction(fields, neighbours)
        neigbours = delete_already_visited_fields(fields, neighbours)
        queue = [...queue,...neigbours]
        animation_queue = [...animation_queue,...neigbours]
        fields[i][j].visited = true
        fields[i][j].color = 'pink'
        //fields[i][j].draw(ctx)
        ctx.clearRect(0,0, canvas.width, canvas.height)
        wait(200)
        for(k = 0; k < fields.length; k++){
            for(l = 0; l < fields[0].length; l++){
                console.log(k)
                console.log(l)
                fields[k][l].draw(ctx)
            }
        
        }
        queue = [...eliminate_duplicates([...queue])]
        console.log(queue)
        
    }while(queue.length > 0 && !fields[i][j].end_point)    
}
//----------------------------------------------------------------------------------------------
//finished
//-------------------------------------------------------------------------------------------------
function eliminate_duplicates(arr){
    arr = arr.map(JSON.stringify).filter((el, i, ar)=> i === ar.indexOf(el)).map(JSON.parse)
    return arr
}
//--------------------------------------------------------------------------------------------

function delete_already_visited_fields(fields, list){
    var not_visited_fields = new Array()
    for(i = 0; i < list.length; i++){
        if(!fields[list[i][0]][list[i][1]].visited){
            not_visited_fields.push([list[i][0],list[i][1]])
        }
    }

    return not_visited_fields
}
function dfs(fields, startpoint){
    var i = startpoint[0]
    var j = startpoint[1]
    var queue = [[i,j]]
    do{
        next = queue[0]
        i = next[0]
        j = next[1]
        queue = queue.slice(1)
        neighbours = get_neighbours(fields, i, j)
        neighbours = check_if_field_is_obstrruction(fields, neighbours)
        neigbours = delete_already_visited_fields(fields, neighbours)
        queue = [...neigbours,...queue]
        fields[i][j].visited = true
        fields[i][j].color = 'pink'
        fields[i][j].draw(ctx)
        queue = [...eliminate_duplicates([...queue])]
        console.log(queue)
        
    }while(queue.length > 0 && !fields[i][j].end_point)
}

function draw(){
    for(i = 0; i < fields.length; i++){
        for(j = 0; j < fields[0].length; j++){
            fields[i][j].draw(ctx)
        }
    }
}
//main:
var fields = new Array((max_height - (max_height % grid_width)) / grid_width )
for(i = 0; i < fields.length; i++){
    fields[i] = new Array((max_width - (max_width % grid_width)) / grid_width)
}
console.log(max_height / grid_width)
for(i = 0; i < max_height / grid_width; i++){
    for(j = 0; j < max_width / grid_width; j++){
        fields[i][j] = new Field(j * grid_width, i * grid_width, "black")
    }

}
console.log(fields)

draw()
canvas.addEventListener("mousedown", start_drawing_obstruction)
canvas.addEventListener("mouseup", stop_drawing_obstruction)
canvas.addEventListener("mousemove", draw_obstruction)
window.addEventListener("resize", set_nav_height)
window.addEventListener("DOMContentLoaded", set_nav_height)
window.addEventListener("dblclick", set_start_and_end_point)
const button = document.getElementById('Run')
button.addEventListener("click",(event) => bfs(fields,startpoint))

