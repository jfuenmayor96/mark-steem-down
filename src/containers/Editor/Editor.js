import React, { Component } from 'react';
import "./Editor.css"
import Remarkable from "remarkable";

class Editor extends Component {
    constructor() {
        super();
        // Methods
        this.archivePost = this.archivePost.bind(this);
        this.clearPost = this.clearPost.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.getRawMarkup = this.getRawMarkup.bind(this);
        this.handleBold = this.handleBold.bind(this);
        this.handleCenter = this.handleCenter.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCode = this.handleCode.bind(this);
        this.handleHeading = this.handleHeading.bind(this);
        this.handleImage = this.handleImage.bind(this);
        this.handleItalics = this.handleItalics.bind(this);
        this.handleKeyboardSelection = this.handleKeyboardSelection.bind(this);
        this.handleLink = this.handleLink.bind(this);
        this.handleOList = this.handleOList.bind(this);
        this.handleQuote = this.handleQuote.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleSeparator = this.handleSeparator.bind(this);
        this.handleStrike = this.handleStrike.bind(this);
        this.handleUList = this.handleUList.bind(this);
        this.handleUnderline = this.handleUnderline.bind(this);
        this.loadPost = this.loadPost.bind(this);
        this.sliceString = this.sliceString.bind(this);

        // Variables
        this.beg = undefined; // Beginning of the string/text
        this.end = undefined; // End of the string/text
        this.post = undefined; // Text area that contains the text. Selected once the component is mounted.
        this.postId = 0; // Contains the ID of the next post to be archived
        this.postArray = []; // Stores objects that contain the post titles and content
        this.loadedPost = undefined; // Stores the ID of the last post loaded
        this.selection = ""; // Selection

        /*  start: saves the starting index of the selected string
            end:   saves the ending index of the selected string */
        this.state = {
            "start": undefined,
            "end": undefined,
            "value": "# Start writing your text above"
        }
    }

    // The <textarea> is selected after the component is mounted, when the textarea is already rendered in order
    // to avoid undefined element selection error.
    componentDidMount() {
        this.post = document.getElementById("post");
        this.title = document.getElementById("title");
    }

    /* Archive the current post. If the current post was loaded, then the archive option updates that post in
    postArray, else, create a new object and stores it in postArray. */
    archivePost() {
      var post = {};

      if(document.getElementById("title").value) {
        post.title = document.getElementById("title").value;
      }
      else {
        post.title = "Untitled post";
      }

      if(document.getElementById("post").value) {
        post.post = document.getElementById("post").value;
      }
      else {
        post.post = "";
      }

      /*If the current post was previously loaded, updates it*/
      if (this.loadedPost) {
        this.postArray[this.loadedPost].title = post.title;
        this.postArray[this.loadedPost].post = post.post;
      }
      /*Else, the post is stored as a new one*/
      else{
        post.id = this.postId;
        this.postId = this.postId + 1; // Updates the post ID for the next post to be created
        this.postArray.push(post);
      }

      /*Clears the text area*/
      this.clearPost();
    }

    /* Copy the post to the user's clipboard*/
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

    /* Clears the textarea*/
    clearPost(){
        this.post.value = "";
        this.title.value = "";
        this.setState({value: ""});
        this.loadedPost = undefined;
    }

    /* Updates the state of the application to with the current text of the <textarea>
       This method was taken from the example "A Component Using External Plugins"
       in https://facebook.github.io/react/
    */
    getRawMarkup() {
        var md = new Remarkable();
        return { __html: md.render(this.state.value) };
    }

    /* Modifies the string to add bold format */
    handleBold(){
        this.sliceString();
        this.post.value = this.beg + "**" + this.selection + "**" + this.end;
    }

    /* Modifies the string to insert a centered format*/
    handleCenter(){
        this.sliceString();
        this.post.value = this.beg + "<center>" + this.selection + "</center>" + this.end;
    }

    /* Updates the state of the app in order to show the new changes in the preview */
    handleChange(){
        this.setState({"value": this.post.value});
    }

    /* Modifies the string to insert an inline code*/
    handleCode(){
        this.sliceString();
        this.post.value = this.beg + "`" + this.selection + "`" + this.end;
    }

    /* Modifies the string to insert a heading (<h1>)*/
    handleHeading(){
        this.sliceString();
        this.post.value = this.beg + "# " + this.selection + this.end;
    }

    /* Modifies the string to add the format for an image*/
    handleImage(){
        this.sliceString();
        this.post.value = this.beg + "![Alt text]" + this.selection + "(http://url-to-image.com 'Image title')" + this.end;
    }

    /* Modifies the string to add italic format */
    handleItalics(){
        this.sliceString();
        this.post.value = this.beg + "*" + this.selection + "*" + this.end;
    }

    /* Handles the selection when the user is using the keyboard (crtl + shift + arrows)
       Note: for some misterious reason, the start position when the selection is made
       with the keyboard is one position delayed*/
    handleKeyboardSelection(){
        this.setState({
            "start": this.post.selectionStart,
            "end": this.post.selectionEnd+1
        });
    }

    /* Modifies the string to add the format for a link*/
    handleLink(){
        this.sliceString();
        this.post.value = this.beg + "[" + this.selection + "](http://example.com)" + this.end;
    }

    /* Modifies the string to add an ordered list from a selection of lines. The lines
    are splitted using the new line character (\n). Then, the list is composed using a
    numeral (var i : int) and appended to the variable 'text'. Finally text contains a
    string like this: '1. my\n2. new\n3. list\n' and this string is appended to the post
    content.*/
    handleOList(){
        this.sliceString();
        var list = this.selection.split(/\n/);
        var text = "";
        var i = 1;
        list.map(function(word){
            text = text + " " + i.toString() + ". " + word + "\n";
            i = i + 1;
        })
        this.post.value = this.beg + text + this.end;
    }

    /* Modifies the string to insert a quote */
    handleQuote(){
        this.sliceString();
        this.post.value = this.beg + "> " + this.selection + "\n" + this.end;
    }

    /* Handles the user selection: saves in the state the begginning and ending position of the selection
    within the string */
    handleSelection(){
        this.setState({
            "start": this.post.selectionStart,
            "end": this.post.selectionEnd
        });
    }

    /* Modifies the string to insert a separator (<hr>)*/
    handleSeparator(){
        this.sliceString();
        this.post.value = this.beg + "___" + this.selection + "\n" + this.end;
    }

    /* Modifies the string to add strike-through format */
    handleStrike(){
        this.sliceString();
        this.post.value = this.beg + "~~" + this.selection + "~~" + this.end;
    }

    /* Same case of handleOList() but using '-' instead of numbers. */
    handleUList(){
        this.sliceString();
        var list = this.selection.split(/\n/);
        var text = "";
        list.map(function(word){
            text = text + " - " + word + "\n";
        })
        this.post.value = this.beg + text + this.end;
    }

    /* Modifies the string to add underline format */
    handleUnderline(){
        this.sliceString();
        this.post.value = this.beg + "__" + this.selection + "__" + this.end;
    }

    /*Get the post ID selected in #postSelector and loads the post into the editor*/
    loadPost() {
      var id = document.getElementById("postSelector").value;
      if(id){
        this.loadedPost = id;
        document.getElementById("title").value = this.postArray[id].title;
        document.getElementById("post").value = this.postArray[id].post;
        this.setState({value: this.postArray[id].post});
      }
      else{
        console.log("Invalid post selected");
      }
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
                    {/*Editor's buttons area*/}
                    <div className="row" style={{paddingBottom: "10px"}}>
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                        <div className="col-lg-6 col-md-6 col-sm-8 col-xs-10 text-center">
                            <button className="btn btn-default editor" onClick={this.handleBold}><i className="fa fa-bold" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleItalics}><i className="fa fa-italic" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleUnderline}><i className="fa fa-underline" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleStrike}><i className="fa fa-strikethrough" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleLink} title="Bold" alt="Bold"><i className="fa fa-link" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleImage} ><i className="fa fa-picture-o" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleUList} ><i className="fa fa-list-ul" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleOList} ><i className="fa fa-list-ol" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleCode} ><i className="fa fa-code" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleQuote} ><i className="fa fa-quote-right" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleCenter} ><i className="fa fa-align-center" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleHeading} ><i className="fa fa-text-height" aria-hidden="true"></i></button>
                            <button className="btn btn-default editor" onClick={this.handleSeparator}><i className="fa fa-window-minimize" aria-hidden="true"></i></button>
                        </div>
                        <span className="col-lg-3 col-md-3 col-sm-2 col-xs-1"></span>
                    </div>
                    {/*Editor's area*/}
                    <div className="row">
                        <div className="col-lg-offset-3 col-md-offset-3 col-sm-offset-2 col-xs-offset-1 col-lg-6 col-lg-6 col-sm-8 col-xs-10">
                          <textarea style={{marginBottom: "10px", width: "100%"}} rows="1" id="title" name="title" placeholder="Title"></textarea><br/>
                          <textarea style={{width: "100%"}} rows="12" id="post" name="post" onMouseUp={this.handleSelection} onKeyUpCapture={this.handleKeyboardSelection} onChange={this.handleChange} placeholder="Hello world"></textarea>
                        </div>
                      {/*Archived posts*/}
                        <div className="col-lg-3 col-md-3 col-sm-2 col-xs-1">
                          <h2 style={{fontSize: "24px", textAlign: "center", marginTop: "0px", paddingTop: "0px"}}>Archived posts</h2>
                          <select id="postSelector" className="pull-right" style={{width: "100%"}}>
                            {this.postArray.map(post => {
                              return(
                                <option value={post.id}>{post.id} - {post.title}</option>
                              );
                            })}
                          </select>
                        </div>
                    </div>
                    {/*Copy to clipboard and clear button's area*/}
                    <div className="row">
                        <div className="col-lg-3 col-md-3"></div>
                        <div className="btn-group col-lg-6 col-md-6 col-sm-12 col-xs-12" id="botones" role="group">
                            <div className="btn-group" role="group">
                                <button onClick={this.copyToClipboard} className="btn btn-default">Copy to clipboard</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button onClick={this.clearPost} className="btn btn-default">Clear</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button onClick={this.archivePost} className="btn btn-default">Archive</button>
                            </div>
                            <div className="btn-group" role="group">
                                <button onClick={this.loadPost} className="btn btn-default">Load</button>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3"></div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3 col-md-3"></div>
                        <div className="content col-lg-6 col-md-6 col-sm-12 col-xs-12" dangerouslySetInnerHTML={this.getRawMarkup()}/>
                        <div className="col-lg-3 col-md-3"></div>
                    </div>

                    {/* Instructions and tips*/}
                    <div className="row">
                        <div className="col-lg-6" style={{paddingLeft: "30px", paddingRight: "30px"}}>
                            <h2>Instructions</h2>
                            <ol>
                                <li><span>Select the text you would like to format.</span></li>
                                <li><span>Click on one of the options above the text area.</span></li>
                                <li><span>Start enjoying and writing amazing posts.</span></li>
                            </ol>
                            <h2>Support and feedback</h2>
                            <p style={{textAlign: "justify"}}>If you have any comments, suggestions or want to add more tips and tricks, please leave them as a comment in the original Steemit post <a href="https://steemit.com/steemit/@jfuenmayor96/mark-steem-down-edit-your-steemit-posts-easier">here</a> or create an issue in the <a href="https://github.com/jfuenmayor96/mark-steem-down">Github repo</a>. If you like my work, please consider making upvote in Steemit and resteeming the post, or making a little donation in <a href="https://paypal.me/jfuenmayor96">Paypal</a> or <a href="https://steemit.com/@jfuenmayor96">Steemit</a>.</p>
                        </div>
                        <div className="col-lg-6" style={{paddingLeft: "30px", paddingRight: "30px"}}>
                            <h2>Tips and tricks</h2>
                            <ul>
                                <li>If you want to use different <b>headings</b>, use multiple #, for example:<br/>
                                Use # for a <code>h1</code> heading.<br/>
                                Use ## for a <code>h2</code> heading.<br/>
                                And so on...<br/>
                                </li>
                                <li>If you want to write a <b>block of code</b> <br/>
                                <pre><code>like<br/>this<br/>one<br/></code></pre><br/>
                                Use 3 back sticks <code>`</code> to wrap your code.</li>
                            </ul>
                        </div>
                        <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{textAlign: "center", paddingTop: "25px", paddingLeft: "30px", paddingRight: "30px"}}>
                                <a href="https://jfuenmayor96.github.io" alt="Julio Fuenmayor's personal portfolio"><i className="fa fa-2x fa-briefcase" aria-hidden="true"> </i></a>
                                <a href="https://github.com/jfuenmayor96" alt="Julio Fuenmayor's Github account"><i className="fa fa-2x fa-github" aria-hidden="true"> </i></a>
                                <a href="https://twitter.com/jfuenmayor96" alt="Julio Fuenmayor's Twitter account"><i className="fa fa-2x fa-twitter" aria-hidden="true"> </i></a>
                                <a href="https://medium.com/@jfuenmayor96" alt="Julio Fuenmayor's Medium Account"><i className="fa fa-2x fa-medium" aria-hidden="true"> </i></a>

                            </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Editor;
