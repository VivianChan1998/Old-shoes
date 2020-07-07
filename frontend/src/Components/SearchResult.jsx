import React from 'react'


export default class SearchResult extends React.Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }
    render(){
        return(
            <div>
                <h3>{this.props.data.displayName}</h3>
                {
                    this.props.data.image? 
                    <img src={this.props.data.image.thumbnailUrl} />:''
                }
            </div>
        )
    }
}