import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { timelineArray, classDuration } from './hotspotsData';
import { Popover } from 'react-tiny-popover'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle, resistance, hotspot, duration) => ({
  userSelect: 'none',
  padding: '10px',
  border: `2px solid ${hotspot === 'Warmup' ? 'orange' : hotspot === 'Cooldown' ? 'lightblue' : hotspot === 'Stretch' ? 'yellow' : 'red' }`,
  background: isDragging ? 'orange' : 'rgb(41, 43, 199)',
  height: `${resistance}0px`,
  width: `${duration}px`,
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  width: '100%',
  // width: `${classDuration}px`,
  // background: isDraggingOver ? 'lightgrey' : 'black',
  background: 'black',
  display: 'flex',
  justifyContent: 'center',
  padding: '10px',
  overflow: 'auto',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: timelineArray,
      isPopoverOpen: false,
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
      <div className="everything">
        <h1>GUIDED CLIMB TIMELINE</h1>
        <div className="timeline-div">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal" >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {this.state.items.map((item, index) => (
                    <Popover
                      isOpen={this.state.isPopoverOpen}
                      positions={['top', 'bottom', 'left', 'right']}
                      content={
                        <div className="popover">
                          {item.hotspot} <br />
                          {/* {item.tempo} <br />
                          {item.reach} <br />
                          {item.resistance} <br /> */}
                          :{item.duration}
                        </div>}
                    >
                      <div className="target">
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              onMouseOver={() => {
                                this.setState({ isPopoverOpen: !this.state.isPopoverOpen })
                              }}
                              onMouseOut={() => {
                                this.setState({ isPopoverOpen: !this.state.isPopoverOpen })
                              }}
                              onTouchEnd={() => {
                                this.setState({ isPopoverOpen: !this.state.isPopoverOpen })
                              }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                item.resistance,
                                item.hotspot,
                                item.duration
                              )}
                            >
                              <div className="hover-point">
                                
                              </div>
                            </div>
                          )}
                        </Draggable>
                      </div>
                    </Popover>

                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));