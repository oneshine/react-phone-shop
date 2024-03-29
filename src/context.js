import React,{Component} from 'react';
import {storeProducts, detailProduct} from './data';
const ProductContext = React.createContext();
//Provider
//Consumer


class ProductProvider extends Component{

  state={

    products: [],
    detailProduct :  detailProduct,
    cart : [],
    modalOpen : false,
    modalProduct : detailProduct,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0

  };

  componentDidMount(){
    this.setProducts();
  }


  setProducts = () =>{
    let tempProducts = [];
    storeProducts.forEach(item =>{
      const singleItem = {...item};
      tempProducts = [...tempProducts,singleItem];

    })
    this.setState(()=>{
      return {products: tempProducts}
    })
  } // setProducts


getItem = (id) =>{
  const product = this.state.products.find(item => item.id === id);
  return product;
}

handleDetail = (id)=>{
  const product = this.getItem(id);
  this.setState(()=>{
    return {detailProduct : product}
  });
};

addToCart = id =>{

  let tempProducts = [...this.state.products];
  const index = tempProducts.indexOf(this.getItem(id));
  const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
  const price = product.price;
        product.total = price;

        this.setState(
          ()=>{
          return { products: tempProducts , cart: [...this.state.cart,product] };
        },
         ()=>{
           this.addTotals();
           console.log(this.state);
         }
      );
}; // add to cart

openModal = id => {
  const product = this.getItem(id);
  this.setState(()=>{
    return {modalProduct: product, modalOpen: true}
  });
} // oepnModal

closeModal = () => {
  this.setState(()=>{
    return {modalOpen : false }
  });
};// closeModal

increment = id =>{

// 1.copy
  let   tempCart = [...this.state.cart];

//2.select product id only
  const selectedProduct = tempCart.find(item => item.id === id);
  const index = tempCart.indexOf(selectedProduct);
  const product = tempCart[index];

        product.count = product.count + 1;
        product.total = product.count * product.price;

//modify cart array
this.setState(()=>{
  return{
    cart:[...tempCart]}
  },()=>{this.addTotals()}
);

}// increment



decrement = id =>{

  // 1.copy
    let   tempCart = [...this.state.cart];

  //2.select product id only
    const selectedProduct = tempCart.find(item => item.id === id);
    const index = tempCart.indexOf(selectedProduct);
    const product = tempCart[index];

          product.count = product.count - 1;
          if(product.count === 0){
              this.removeItem(id);
          }//if
          else{
            product.total = product.count * product.price;
            this.setState(()=>{
              return{
                cart:[...tempCart]}
              },()=>{this.addTotals()}
            );
          }//else

}// decrement

removeItem = id =>{
  let tempProducts = [...this.state.products];
  let tempCart = [...this.state.cart];

  tempCart = tempCart.filter(item => item.id !== id);

const index = tempProducts.indexOf(this.getItem(id));
let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

this.setState(()=>{
  return {
    cart : [...tempCart],
    products: [...tempProducts],
  }
},()=>{
    this.addTotals();
})
  console.log('item removed');
}// removeitem

clearCart = () =>{
  this.setState(()=>{
    return {cart: []}
  },()=>{
    this.setProducts(); // clear state to default value
    this.addTotals();

  });
  console.log('cart was cleared');
}// clearCart

addTotals =()=>{
  let subTotal = 0;
  this.state.cart.map(item => (subTotal += item.total));
  const tempTax = subTotal * 0.07;
  const tax = parseFloat(tempTax.toFixed(2));
  const total = subTotal + tax;

  this.setState(()=>{
    return{
      cartSubTotal : subTotal,
      cartTax: tax,
      cartTotal: total
    }
  })
}//addTotals


  render(){
    return(
      <ProductContext.Provider
      value={{
        ...this.state,
        handleDetail:this.handleDetail,
        addToCart: this.addToCart,
        openModal: this.openModal,
        closeModal: this.closeModal,
        increment: this.increment,
        decrement: this.decrement,
        removeItem: this.removeItem,
        clearCart: this.clearCart
      }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}


const ProductConsumer = ProductContext.Consumer;

export {ProductProvider,ProductConsumer};






/**  2:39 Line 36 <button onClick={this.tester}>test</button> **/

//------2:39---------------------------------------------------//
// tester = () => {
//   console.log('State products : ',this.state.products[0].inCart);
//   console.log('Data products : ',storeProducts[0].inCart);
//
//   const tempProducts = [...this.state.products];
//         tempProducts[0].inCart = true
//         this.setState(()=>{
//           return {products: tempProducts}
//         },()=>{
//
//           console.log('State products : ',this.state.products[0].inCart);
//           console.log('Data products : ',storeProducts[0].inCart);
//         })//setState
//
// } //tester
//------2:39---------------------------------------------------//
