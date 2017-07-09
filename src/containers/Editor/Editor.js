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
        this.handleKeyboardSelection = this.handleKeyboardSelection.bind(this);
        this.handleUnderline = this.handleUnderline.bind(this);
        this.handleLink = this.handleLink.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.handleOList = this.handleOList.bind(this);
        this.handleUList = this.handleUList.bind(this);
        this.handleCode = this.handleCode.bind(this);
        this.handleQuote = this.handleQuote.bind(this);
        this.handleCenter = this.handleCenter.bind(this);
        this.handleHeading = this.handleHeading.bind(this);
        this.handleSeparator = this.handleSeparator.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.clearPost = this.clearPost.bind(this);
        this.previewPost = this.previewPost.bind(this);

        this.sliceString = this.sliceString.bind(this);
        
        // Variables 
        this.beg = undefined; // Beginning of the string/text
        this.end = undefined; // End of the string/text
        this.post = undefined; // Text area that contains the text
        this.selection = ""; // Selection
        
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

    handleKeyboardSelection(){
        this.setState({
            "start": this.post.selectionStart-1,
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

    handleLink(){
        this.sliceString();
        this.post.value = this.beg + "[" + this.selection + "](http://example.com)" + this.end;
    }

    handleImage(){
        this.sliceString();
        this.post.value = this.beg + "![Alt text]" + this.selection + "(http://url-to-image.com 'Image title')" + this.end;
    } 

    handleOList(){
        this.sliceString();
        //console.log("selection: " + this.selection);
        var list = this.selection.split(/\n/);
        //console.log(list);
        var text = "";
        var i = 1;
        list.map(function(word){
            text = text + " " + i.toString() + ". " + word + "\n";
            i = i + 1;
        })
        this.post.value = this.beg + text + this.end;
    }

    handleUList(){
        this.sliceString();
        var list = this.selection.split(/\n/);
        var text = "";
        list.map(function(word){
            text = text + " - " + word + "\n";
        })
        this.post.value = this.beg + text + this.end;
    }

    handleCode(){
        this.sliceString();
        this.post.value = this.beg + "`" + this.selection + "`" + this.end;
    } 

    handleQuote(){
        this.sliceString();
        this.post.value = this.beg + "> " + this.selection + "\n" + this.end;
    } 

    handleCenter(){
        this.sliceString();
        this.post.value = this.beg + "<center>" + this.selection + "</center>" + this.end;
    } 

    handleHeading(){
        this.sliceString();
        this.post.value = this.beg + "# " + this.selection + this.end;
    } 

    handleSeparator(){
        this.sliceString();
        this.post.value = this.beg + "___" + this.selection + "\n" + this.end;
    }
    
    copyToClipboard(e){
        e.preventDefault();
        var copyTextarea = document.getElementById('post');
        copyTextarea.select();
        try{
            document.execCommand('copy');
            console.log("Post copied succesfully.");
        }
        catch(err){
            console.log("Unable to copy the post. Please, do it manually selecting the text and pressing Crtl + C keys.");
            console.log(err)
        }
    }
    
    clearPost(){
        this.post.clear();
    }
    
    previewPost(){}

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
                    <div className="row" style={{paddingBottom: "10px"}}>
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                        <div className="col-lg-6 text-center">
                            <button onClick={this.handleBold}><i className="fa fa-bold" aria-hidden="true"></i></button>
                            <button onClick={this.handleItalics}><i className="fa fa-italic" aria-hidden="true"></i></button>
                            <button onClick={this.handleUnderline}><i className="fa fa-underline" aria-hidden="true"></i></button>
                            <button onClick={this.handleStrike}><i className="fa fa-strikethrough" aria-hidden="true"></i></button>
                            <button onClick={this.handleLink} title="Bold" alt="Bold"><i className="fa fa-link" aria-hidden="true"></i></button>    
                            <button onClick={this.handleImage} ><i className="fa fa-picture-o" aria-hidden="true"></i></button> 
                            <button onClick={this.handleUList} ><i className="fa fa-list-ul" aria-hidden="true"></i></button>                           
                            <button onClick={this.handleOList} ><i className="fa fa-list-ol" aria-hidden="true"></i></button>
                            <button onClick={this.handleCode} ><i className="fa fa-code" aria-hidden="true"></i></button>  
                            <button onClick={this.handleQuote} ><i className="fa fa-quote-right" aria-hidden="true"></i></button>    
                            <button onClick={this.handleCenter} ><i className="fa fa-align-center" aria-hidden="true"></i></button>  
                            <button onClick={this.handleHeading} ><i className="fa fa-text-height" aria-hidden="true"></i></button>  
                            <button onClick={this.handleSeparator}><i className="fa fa-window-minimize" aria-hidden="true"></i></button>
                        </div>
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                    </div>
                    <div className="row">
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                        <textarea className="col-lg-6 col-lg-6 col-sm-8 col-xs-10" rows="12" id="post" name="post" onMouseUp={this.handleSelection}></textarea>
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                    </div>  
                    <div className="row">
                        <div className="col-lg-3"></div>
                        <div className="btn-group col-lg-6" id="botones" role="group">
                            <div className="btn-group" role="group">
                                <button onClick={this.copyToClipboard} className="btn btn-default">Copy to clipboard</button>
                            </div>    
                            <div className="btn-group" role="group">
                                <button onClick={this.clearPost} className="btn btn-default">Clear</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button onClick={this.previewPost} className="btn btn-default">Preview</button>
                            </div>
                        </div>    
                        <div className="col-lg-3"></div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3"></div>
                        <div className="col-lg-6">
                            <h2>Instructions</h2>
                            <ol>
                                <li><span>Select the text you would like to format.</span></li>
                                <li><span>Click on one of the options above the text area.</span></li>
                                <li><span>Start enjoying and writing amazing posts.</span></li>
                            </ol>
                            <br/>
                            <h2>Tips and tricks</h2>
                            <ul>
                                <li>If you want to use different <b>headings</b>, use multiple #, for example:<br/>
                                Use # for a <code>h1</code> heading <h1 style={{color: "#005b96"}}>Like this one</h1><br/>
                                Use ## for a <code>h2</code> heading <h2 style={{color: "#005b96"}}>Like this one</h2><br/>
                                And so on...<br/>
                                </li>
                                <li>If you want to write a <b>block of code</b> <br/>
                                <pre><code>like<br/>this<br/>one<br/></code></pre><br/>
                                Use 3 back sticks <code>`</code> to wrap your code.</li>
                            </ul>
                        </div>
                        <div className="col-lg-3"></div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Editor;