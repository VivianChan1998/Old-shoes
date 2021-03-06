import React from 'react'
import Camera from '../Components/Camera'
import { Modal } from 'office-ui-fabric-react'
import 'react-image-crop/dist/ReactCrop.css';
import './ImgInput.css'
import { DefaultButton } from 'office-ui-fabric-react';
import ImageSearchResult from './ImgSearchResult';

export default class ImgInput extends React.Component{
    constructor(){
        super()
        this.state={
            tags: [[]],
            default: [],
            srcType: '',
            srcURL: '',
            src: '',
            isModalOpen: false,
            isResultOpen: false,
            data: {
                main: '',
                size: '',
                classification: ''
            },
            pending: false,
            price: 'calculating...'
        }
        this.fileInput = React.createRef();
    }
    async handleSubmit(){
        this.setState({pending: true})
        var form = new FormData()

        form.append("file", this.state.src)
        const settings = {
            method: 'POST',
            body: form,
        }
        var url = this.state.srcType === 'photo' ? 'http://localhost:3000/recieve-img-url' : 'http://localhost:3000/recieve-img'
        let res = await fetch(url, settings)
        let data = await res.json()

        this.setState({
            data: {
                main: data.data.main,
                size: data.data.size,
                classification: data.data.classification
            },
            isResultOpen: true,
            pending: false
        })
        this.handleImgSearch()
    }
    
    handleImgSearch(){
        var subscriptionKey = ''; //Place your subsciption key from Azure Cognitive Search here!
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
        var market = 'en-US'; //temp
        var safeSearch = 'moderate'; //temp
        var baseUrl = `https://old-shoes.cognitiveservices.azure.com/bing/v7.0/images/visualsearch?mkt=${market}&safesearch=${safeSearch}`;
        //cognitive services
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

        this.setState({tags: data.tags})
    }
    
    handleImageName(){
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
                <div className='upload-section'>
                    <h1>Upload your photo, show us your shoes</h1>
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
                            <div />
                        </div>
                        :<img src={this.state.srcURL} alt='no-input'/>
                    }
                    {
                        this.state.pending?
                        <div id='loading'>
                            <h3>Loading...</h3>
                        </div>
                        :
                        ''
                    }   
                </div>

                
                
                <button className={this.state.src? 'submit-upload-image green-button' : 'submit-upload-image submit-disable'} onClick={()=>this.handleSubmit()}>
                    Submit
                </button>
                <Modal
                    titleAriaId='ResultModal'
                    isOpen={this.state.isResultOpen}
                    onDismiss={() => this.setState({isResultOpen: false})}
                    isBlocking={false}
                    containerClassName={''}
                 >
                    <div className='Result'>
                        <img src={this.state.srcURL} alt='calc-result'/>
                        <ResultText title='Brand' value={this.state.data.main} />
                        <ResultText title='Size' value={this.state.data.size} />
                        <ResultText title='classification' value={this.state.data.classification} />
                        {
                            this.state.tags === undefined?
                            <h3>Nope</h3>:
                            <ImageSearchResult tags={this.state.tags} classification={this.state.data.classification}/>
                        }
                        <DefaultButton text='Close' onClick={() => this.setState({isResultOpen: false})}/>
                    </div>
                </Modal>
            </div>
        )
    }
}

function ResultText(props){
    return(
        <div className='ResultText'>
            <h3>{props.title}</h3>
            <p>{props.value || 'N/A'}</p>
        </div>
    )
}