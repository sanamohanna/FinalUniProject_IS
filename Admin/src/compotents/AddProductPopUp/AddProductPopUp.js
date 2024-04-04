import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import api from '../../config.js';
import { Dropdown } from 'primereact/dropdown';
import { Messages } from 'primereact/messages';
 
function ProductPopUp(props) {
  const msgs = useRef(null)
 
  const [categories, setCategories] = useState([]);
  const [data, setData] = React.useState({
    productName: '',
    price: '',
    description: '',
    categoryid: null
  })
 
  useEffect(() => {
    fetch(`${api.apiRequest}/category`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Failed to fetch categories:", error));
  }, []);
 
  const onChange = (key) => (e) => setData({ ...data, [key]: e.target.value })
 
  const AddProduct = async () => {
 
    try {
      const body = data
      let message = ''
      const requiredFields = [
        'productName',
        'price',
        'description',
        'categoryid'
      ]
      const hasEmptyFields = requiredFields.some((field) => !data[field])
 
      if (hasEmptyFields) {
        message = 'Fields  are missing Please insert required data'
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      } else if (
        !(data.productName.length < 4 )
      ) {
        message = 'The product name should be contain 4 letter at least '
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      } else if (!/^[A-Za-z]*$/.test(data.productName)) {
        message = 'Characters must be only in english'
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      }  
      else if (!(data.price <1 )) {
        message = 'the price must be more than 1 '
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      }
      else if (!/^[0-9]*$/.test(data.price)) {
        message = 'price  must only numbers'
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      }
 
     
 
    } catch (error) {
      throw new Error('adding product failed')
    }
  }
 
  return (
    <div
      className="card flex justify-content-center"
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        alignItems: 'center'
      }}
    >
 
      <InputText
        id="productName"
        value={data.productName}
        type="text"
        name="productName"
        placeholder="employee productName"
        style={{ width: '208px' }}
        required
        onChange={onChange('productName')}
      />
      <br />
      <InputText
        id="description"
        value={data.description}
        type="text"
        name="description"
        placeholder="description"
        style={{ width: '208px' }}
        required
        onChange={onChange('description')}
      />
      <br />
      <InputText
        id="phone"
        value={data.phone}
        type="text"
        name="phone"
        placeholder="phone"
        style={{ width: '208px' }}
        required
        onChange={onChange('phone')}
      />
      <br />
      <InputText
        id="price"
        value={data.price}
        type="text"
        name="price"
        placeholder="price"
        style={{ width: '208px' }}
        required
        onChange={onChange('price')}
      />
      <br />
      <Dropdown
        value={data.categoryid}
        onChange={onChange('categoryid')}
        options={categories}
        optionLabel="categoryid"
        placeholder="Select category"
        optionValue="id"
        className="w-full md:w-14rem"
      />
      <br />
      <Button
        id="add"
        label="add employee"
        icon="pi pi-check"
        autoFocus
        onClick={AddProduct}
      />
      <Messages ref={msgs} />
    </div>
  )
}
export default ProductPopUp;