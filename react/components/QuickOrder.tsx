
import React, { useState, useEffect } from 'react'
import  { useMutation, useLazyQuery } from 'react-apollo'
import UPDATE_CART from '../graphql/updateCart.graphql'
import GET_PRODUCT from '../graphql/getProductBySku.graphql' 
import { useCssHandles } from 'vtex.css-handles'

import "./styles.css"

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("") 

  const [getProductData, { data: product}] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART) 

  const handleChange = (evt:any) => {
    setInputText(evt.target.value)
    console.log("Input changed:", inputText);
  }
  const CSS_HANDLES = [
    "input__quickOrder"
  ]
  const handles = useCssHandles(CSS_HANDLES) 

  useEffect(() => {
    console.log("El resultado de mi producto es:", product, search )
    if(product) {         
      let skuId = parseInt(inputText)
      addToCart ({
        variables:{
          salesChannel: "1",
          items:[
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
      .then(() => {
        window.location.href = "/cart"
      }) 
    }  
  }, [product, search]) 

  const addProductToCart = () => {
      getProductData({    
      variables:{
        sku: inputText
      }      
    })
  } 

  const searchProduct = (evt:any) => {
    evt.preventDefault();
    if (!inputText) {
      alert("Por favor ingrese el Id del producto")
    }else{
      console.log("Estamos buscando:", inputText)
        setSearch(inputText)
        addProductToCart() 
    }    
  }   

  return (
    <div className='pa5 ml5 mr5 mt3 mb3 ba b--light-gray'>
      <h2>Compra rápida</h2>
      <form onSubmit={searchProduct}>
        <div className='flex pt5 pb5'>
          <label className='pr5' htmlFor="sku">Ingresa el número de SKU</label>
          <input id="sku" type="text" onChange={handleChange}></input>
        </div>
        <input type="submit" value="AÑADIR AL CARRITO" className={handles.input__quickOrder} />
      </form>
    </div>
  )
}

export default QuickOrder



