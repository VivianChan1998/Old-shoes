import React from 'react'

export default class ImageSearchResult extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            price: []
        }
    }
    addProducts(products) {
        console.log(products)
        var length = (products.length > 10) ? 20 : products.length;
        var price = []
        var l = []
        for (var j = 0; j < length; j++) {
            var img = <img src={products[j].thumbnailUrl + '&w=120&h=120'} title={products[j].name} />
            console.log(products[j].insightsMetadata.hasOwnProperty('aggregateOffer'))
            if (products[j].insightsMetadata.hasOwnProperty('aggregateOffer')) {
                if (products[j].insightsMetadata.aggregateOffer.offerCount > 0) {
                    var offers = products[j].insightsMetadata.aggregateOffer.offers;
                    // Show all the offers. Not all markets provide links to offers.
                    for (var i = 0; i < offers.length; i++) {  
                        var para = document.createElement('p');

                        var offer = document.createElement('a');
                        offer.text = offers[i].name;
                        offer.setAttribute('href', offers[i].url);
                        offer.setAttribute('style', 'margin: 20px 20px 0 0');
                        offer.setAttribute('target', '_blank')
                        para.appendChild(offer);

                        var span = document.createElement('span');
                        span.textContent = 
                        para.appendChild(span);

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
                else {  // Otherwise, just show the lowest price that Bing found.
                    var offer = products[j].insightsMetadata.aggregateOffer;

                    var para = <p>
                            {img}
                            {`${offer.name} | ${offer.lowPrice} ${offer.priceCurrency}`}
                        </p>

                    l.push(para)
                }
            }
        }
        console.log(price)
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
        console.log(this.props.tags[0].actions)
        var action = this.props.tags[0].actions
        var result = {list: [], price: []}
        if(action !== undefined) {
            for(var i=0; i < action.length; ++i){
                if (action[i].actionType === 'ProductVisualSearch') {
                    console.log('ProductVisualSearch')
                    result = this.addProducts(action[i].data.value)
                }
            }
        }
        console.log(result)
        var price = this.calcAvgPrice(result.price)
        return(
            <div>
                <div>
                    <h3>Price:</h3>
                    <p>{price} USD</p>
                </div>
                {
                    result.list.map(e =>
                        <div>
                            {e}
                        </div>
                    )
                }
            </div>
        )
    }
}