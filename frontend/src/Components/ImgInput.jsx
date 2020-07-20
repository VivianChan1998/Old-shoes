import React from 'react'
import SearchResult from './SearchResult'
import DefaultResult from './DefaultResult';
import Camera from '../Components/Camera'
import ReactCrop from 'react-image-crop';
import { Modal } from 'office-ui-fabric-react'
import 'react-image-crop/dist/ReactCrop.css';
import './ImgInput.css'

class Crop extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            src: null,
            crop: {
              width: 800,
              height: 600
            },
        };
    }
    
    render(){
        return(
            <div>
                <ReactCrop src={this.props.src} crop={this.state.crop} />
            </div>
            
        )
    }
}
export default class ImgInput extends React.Component{
    constructor(){
        super()
        this.state={
            tags: [[]],
            default: [],
            srcType: '',
            srcURL: '',
            src: '',
            isModalOpen: false
        }
        this.fileInput = React.createRef();
    }
    async handleSubmit(){
        var form = new FormData()
        console.log(this.state)
        
        form.append("file", this.state.src)
        const settings = {
            method: 'POST',
            body: form,
        }
        var url = this.state.srcType === 'photo' ? 'http://localhost:3000/recieve-img-url' : 'http://localhost:3000/recieve-img'
        let res = await fetch(url, settings)
        let data = await res.json()
        console.log(data)
    }
    /*
    handleSubmit(){
        var subscriptionKey = '91c59bd9b23c40248d54ffa568c0c33a';
        console.log(this.fileInput)
        var imagePath = this.fileInput;
        if (imagePath.length === 0)
        {
            alert("Please select an image to upload.");
            return;
        }
        var f = this.state.src;
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
        console.log(data)
        //this.setState({tags: data.tags, default: data.tags[0]['actions'][0].data.value})
    }
    */
    handleImageName(){
        /*var fullPath = document.getElementById('uploadImage').value;
        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            
        }*/
        var f = document.getElementById('uploadImage').files[0]
        this.setState({
            srcURL: URL.createObjectURL(f),
            src: f,
            srcType: 'upload'
        })
    }

    render(){
        return(
            <div>
                
                {/*<Crop src={this.state.srcURL} />*/}
                <div className='upload-section'>
                    <div id='upload-wrapper'>
                        <label id='file-input-wrapper'>
                            Upload file
                            <input type="file" accept="image/*" id="uploadImage" name="files[]" size={40}
                                ref={ref => this.fileInput = ref} onChange={() => this.handleImageName()}/>
                        </label>
                    </div>
                    <div id='or'>or</div>
                    <div>
                        <button onClick={() => this.setState({isModalOpen: true})} className="green-button">
                            Take a Photo
                        </button>
                    </div>
                </div>
                
                <Modal
                    titleAriaId='LoginModal'
                    isOpen={this.state.isModalOpen}
                    onDismiss={() => this.setState({isModalOpen: false})}
                    isBlocking={false}
                    containerClassName={''}
                >
                    <div id='camera-wrapper'>
                        <Camera getImage={(srcurl, src)=>{
                            this.setState({
                                srcURL:srcurl,
                                src: src,
                                srcType: 'photo',
                                isModalOpen: false
                            })
                        }}
                        />
                    </div>
                </Modal>
               

                <div id='preview-photo'>
                    {this.state.srcURL===''?
                        <div id='no-photo'>
                            <h3>Upload your photo, show us your shoes</h3>
                            <div />
                        </div>
                        :<img src={this.state.srcURL} />
                    }
                </div>
                
                <button className={this.state.src? 'submit-upload-image green-button' : 'submit-upload-image submit-disable'} onClick={()=>this.handleSubmit()}>
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
