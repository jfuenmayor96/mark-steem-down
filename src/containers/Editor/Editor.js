import React, { Component } from 'react';
import "./Editor.css"

class Editor extends Component {
    constructor() {
        super();
        // Methods
        this.handleBold = this.handleBold.bind(this);
        this.handleItalics = this.handleItalics.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleStrike = this.handleStrike.bind(this);
        this.handleUnderline = this.handleUnderline.bind(this);
        this.sliceString = this.sliceString.bind(this);
        
        // Variables 
        this.beg = undefined; // Beginning of the string/text
        this.end = undefined; // End of the string/text
        this.post = undefined; // Text area that contains the text
        this.sel = undefined; // Selection
        
        /*  start: saves the starting index of the selected string
            end:   saves the ending index of the selected string */
        this.state = {
            "start": undefined,
            "end": undefined
        }
    }

    // The text area is selected after the component is mounted, when the textarea is already rendered
    componentDidMount() {
        this.post = document.getElementById("post");
    }

    /* Handles the user selection: saves in the state the begginning and ending position of the selection 
    within the string */
    handleSelection(){
        this.setState({
            "start": this.post.selectionStart,
            "end": this.post.selectionEnd
        });
    }

    /* Modifies the string to add bold format */
    handleBold(){
        this.sliceString();
        this.post.value = this.beg + "**" + this.selection + "**" + this.end;
    }

    /* Modifies the string to add bold format */
    handleItalics(){
        this.sliceString();
        this.post.value = this.beg + "*" + this.selection + "*" + this.end;
    }

    /* Modifies the string to add bold format */
    handleUnderline(){
        this.sliceString();
        this.post.value = this.beg + "__" + this.selection + "__" + this.end;
    }

    /* Modifies the string to add bold format */
    handleStrike(){
        this.sliceString();
        this.post.value = this.beg + "~~" + this.selection + "~~" + this.end;
    }

    /* Handles the user selection to slice the text */
    sliceString(){
        this.beg = this.post.value.substring(0, this.state.start);
        this.end = this.post.value.substring(this.state.end, this.post.value.lenght);
        this.selection = this.post.value.substring(this.state.start, this.state.end);
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    {/*Title and subtitle*/}
                    <div className="row-fluid">
                        <h1 className="title" style={{textAlign: "center"}}> Mark Steem Down </h1>
                        <h2 style={{textAlign: "center", fontSize: "16px", fontFamily: "Monospace"}}>A simple multipurpose MarkDown text editor</h2>
                    </div>
                    <div className="row">
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                        <div style={{alignContent: "center", display: "flex", flexDirection: "row"}}>
                            <button onClick={this.handleBold}><b>B</b></button>
                            <button onClick={this.handleItalics}><i>i</i></button>
                            <button onClick={this.handleUnderline}><u>u</u></button>
                            <button onClick={this.handleStrike}><s>S</s></button>
                            <button><code>br</code></button>
                        </div>
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                    </div>
                    <div className="row">
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                        <textarea className="col-lg-6 col-lg-6 col-sm-8 col-xs-10" rows="12" id="post" name="post" onMouseUp={this.handleSelection}></textarea>
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                    </div>  
                </div>
            </div>
        );
    }
}

export default Editor;