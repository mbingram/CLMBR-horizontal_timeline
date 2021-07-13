import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { timelineArray, classDuration } from './hotspotsData';
import { Popover } from 'react-tiny-popover'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// const grid = classDuration.length;
const grid = 8;

const resistance = timelineArray.map(item => {
  return item.resistance
});
const duration = timelineArray.map(item => {
  return item.duration
})
const hotspotType = timelineArray.map(item => {
  return item.hotspot
})
const getHotspotType = (hotspotType == 'Warmup') ? 'yellow' : 'red'
console.log(hotspotType)
const getResistance = (resistance > 5) ? 'orange' : 'lightgrey'


const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: 'auto',
  border: `1px solid ${getHotspotType}`,
  background: isDragging ? 'lightblue' : `${getResistance}`,
  height: `${resistance}px`,
  // width: `${duration}px`,
  width: '2px',
  color: 'white',
  display: 'block',
  ...draggableStyle,
});

const timelineLength = timelineArray.length

const getListStyle = isDraggingOver => ({
  margin: "auto",
  width: '75%',
  // width: `${timelineLength}px`,
  background: isDraggingOver ? 'lightgrey' : 'black',
  display: 'flex',
  padding: grid,
  overflow: 'auto',
  textAlign: 'center',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: timelineArray,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items,
    });
  }

  render() {
    return (
      <div className="timeline-div">
        <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.state.items.map((item, index) => (

                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.hotspot} <br />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      </div>
      
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));