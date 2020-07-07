import React from 'react'
import SearchResult from './SearchResult'
import DefaultResult from './DefaultResult';

export default class ImgInput extends React.Component{
    constructor(){
        super()
        this.state={
            tags: [[]],
            default: []
        }
        this.fileInput = React.createRef();
    }
    handleSubmit(){
        var subscriptionKey = '91c59bd9b23c40248d54ffa568c0c33a';
        var imagePath = this.fileInput;
        if (imagePath.length === 0)
        {
            alert("Please select an image to upload.");
            return;
        }
        var f = document.getElementById('uploadImage').files[0];
        this.sendRequest(f, subscriptionKey);
    }
    async sendRequest(file, key) {
        var market = 'zh-TW'; //temp
        var safeSearch = 'moderate'; //temp
        var baseUrl = `https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch?mkt=${market}&safesearch=${safeSearch}`;
        var form = new FormData();
        form.append("image", file);
        const settings = {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': key,
            },
            body: form
        };

        const res = await fetch(baseUrl, settings)
        const data = await res.json()
        this.setState({tags: data.tags, default: data.tags[0]['actions'][0].data.value})
    }

    render(){
        console.log(this.state)
        return(
            <div>
                <p>Select image to get insights from Bing:
                    <input type="file" accept="image/*" id="uploadImage" name="files[]" size={40}
                        ref={ref => this.fileInput = ref} onChange={()=>console.log(this.fileInput)}/>
                </p>
                <button onClick={()=>this.handleSubmit()}>
                    Submit
                </button>
                <div>
                    {this.state.default.map(e => <DefaultResult data={e} />)}
                </div>
                <div>
                    {this.state.tags.map(e => <SearchResult data={e} />)}
                </div>
            </div>
        )
    }
}
