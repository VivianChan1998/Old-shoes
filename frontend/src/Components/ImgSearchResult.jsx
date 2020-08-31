import React from 'react'
import "./ImgSearchResult.css"

export default class ImageSearchResult extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            price: [],
            showDetail: false
        }
    }
    addProducts(products) {
        var length = (products.length > 20) ? 20 : products.length;
        var price = []
        var l = []
        for (var j = 0; j < length; j++) {
            var img = <img src={products[j].thumbnailUrl + '&w=120&h=120'} title={products[j].name} alt={products[j].name}/>
            if (products[j].insightsMetadata.hasOwnProperty('aggregateOffer')) {
                if (products[j].insightsMetadata.aggregateOffer.offerCount > 0) {
                    var offers = products[j].insightsMetadata.aggregateOffer.offers;
                    for (var i = 0; i < offers.length; i++) {  
                        var para = <p>
                                        {img}
                                        <a href={offers[i].url}>
                                            {offers[i].name}
                                        </a>
                                        <span>
                                            by {offers[i].seller.name} | {offers[i].price} {offers[i].priceCurrency}
                                        </span>
                                    </p>
                        price.push(offers[i].price)
                        l.push(para)
                    }
                }
                else {
                    var offer = products[j].insightsMetadata.aggregateOffer;
                    var para = <p>
                            {img}
                            {`${offer.name} | ${offer.lowPrice} ${offer.priceCurrency}`}
                        </p>
                    l.push(para)
                }
            }
        }
        return {
            list: l,
            price: price
        }
    }
    calcAvgPrice(price){
        var avg = 0
        for(var i=0; i<price.length; ++i){
            avg += parseInt(price[i])
        }
        avg = avg / price.length
        return avg
    }
    
    render(){
        var action = this.props.tags[0].actions
        var result = {list: [], price: []}
        if(action !== undefined) {
            for(var i=0; i < action.length; ++i){
                if (action[i].actionType === 'ProductVisualSearch') {
                    result = this.addProducts(action[i].data.value)
                }
            }
        }
        var price = this.calcAvgPrice(result.price) * this.props.classification / 3
        return(
            <div className="imgSearchResult-wrapper">
                <div className='ResultText'>
                    <h3>Price</h3>
                    <p>{isNaN(price)? "Calculating..." : `${price} USD`}</p>
                </div>
                <div className='show-more ResultText' onClick={() => this.setState(prevState => ({showDetail: !prevState.showDetail}))}>
                    <h3> click to {this.state.showDetail? 'Hide':'Show'} other online results  </h3>
                </div>
                {
                    this.state.showDetail?
                    result.list.map(e =>
                        <div className='ResultText Online-result'>
                            {e}
                        </div>
                    ):''
                }
            </div>
        )
    }
}