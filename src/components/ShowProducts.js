 import React, {useEffect, useState} from 'react';
 import axios from 'axios';
 import Swal from 'sweetalert2';
 import withReactContent from 'sweetalert2-react-content';
 import { show_alerta } from '../functions';

 const ShowProducts = () => {

    const url ='http://www.apiMongo.somee.com/api/Producto';
      const [prod,setProducto] = useState([]);
      const [id,setId] = useState('');
      const [nombre, setnombre] = useState('');
      const [descripcion, setdescripcion] = useState('');
      const [Precio, setprecio] = useState('');
      const [Stock, setstock] = useState('')

      const [operation,setOperation] = useState(1);
      const [title,setTitle] = useState('');

      useEffect( () => {
          getProductos();
      },[]);
      
      const getProductos = async () => {
          const respuesta = await axios.get(url);
          setProducto(respuesta.data);
      }

      const openModal = (op, id, nombre, descripcion,Precio,Stock) => {
          setId('');
          setnombre('');
          setdescripcion('');
          setprecio('');
          setstock('');
          setOperation(op);
          if(op === 1){
            setTitle('Registrar Producto')
          }
          else if(op === 2){
            setTitle('Editar Producto')
            setId(id);
            setnombre(nombre);
            setdescripcion(descripcion);
            setprecio(Precio);
            setstock(Stock);
          }
          window.setTimeout(function(){
               document.getElementById('nombre').autofocus();
          },500);
      }
      const validar =() => {
        var parametros;
        var metodo;
        if(nombre.trim() === ''){
            show_alerta('Escribe el nombre del producto','warning');
        }
        else if(descripcion.trim() === ''){
            show_alerta('Escribe la descripcion del producto','warning');
        }
        else if(Precio === ''){
             show_alerta('Escribe el precio del producto','warning');
        }
        else if(Stock === ''){
            show_alerta('Escribe el stock','warning');
       }
        else{
            if(operation === 1){
                parametros ={nombre:nombre.trim(),descripcion:descripcion.trim(),Precio:Precio, Stock:Stock};
                metodo= 'POST';
            }
            else{
                parametros ={id:id,nombre:nombre.trim(),descripcion:descripcion.trim(),Precio:Precio, Stock:Stock};
                metodo= 'PUT';
            }
            enviarSolicitud(metodo,parametros);
        }
      }
      const enviarSolicitud = async(metodo,parametros) => {
        await axios({ method:metodo, url:url, data:parametros}).then(function(respuesta){
              var tipo = respuesta.data[0];
              var msj = respuesta.data[1];
              show_alerta(msj,tipo);
              if(tipo === 'success'){
                document.getElementById('btnCerrar').click();
                getProductos();
              }
        }).catch(function(error){
            show_alerta('Error en la solicitud', 'error');
            console.log(error);
        });
      }
      const deleteProdcto=(id,nombre) =>{
        const Myswal = withReactContent(Swal);
        Myswal.fire({
            title: '¿Seguro de eliminar el producto' + nombre + '?',
            icon: 'question', text: 'No se podra dar marcha atrás',
            showCloseButton:true,confirmButtonText:'Si, eliminar', cancelButtonText:'cancelar'
        }).then((result) =>
        {if(result.isConfirmed){
                 setId(id);
                 enviarSolicitud('DELETE', {id:id});

        }
         else{
            show_alerta('El producto No fue eliminado','info');
         }
    });
      }


  return (
   <div className='App'>
         <div className='container-fluid'>
         <div className='row mt-3'>
                  <div className='col-md-4 offset-md-4'>
                      <div className='d-grid mx-auto'>
                          <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                             <i className='fa-solid fa-circle-plus'></i> Añadir 
                          </button>
                      </div>
                  </div>
              </div>

              <div className='row mt-3'>
                  <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                      <div className='table-responsive'>
                           <table className='table table-bordered'>
                              <thead>
                                  <tr>
                                      <th>#</th>
                                      <th>Nombre</th>
                                      <th>Descripcion</th>
                                      <th>Precio</th>
                                      <th>Stock</th>
                                  </tr>
                              </thead>
                              <tbody className='table-group-divider'>
                                   {prod.map( (prod, i) =>(
                                      <tr key={prod.id}>
                                          <td>{(i+1)}</td>
                                          <td>{prod.nombre}</td>
                                          <td>{prod.descripcion}</td>
                                          <td>${new Intl.NumberFormat('es-mx').format(prod.Precio)}</td>
                                          <td>{prod.Stock}</td>
                                          <td>
                                                <button onClick={() => openModal(2,prod.id,prod.nombre,prod.descripcion,prod.Precio, prod.Stock)} 
                                                       className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                     <i className='fa-solid fa-edit'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteProdcto(prod.id,prod.nombre)} className='btn btn-danger'>
                                                     <i className='fa-solid fa-trash'></i>
                                                </button>
                                          </td>
                                      </tr>
                                      
                                   )
                                   )}
                              </tbody>
                           </table>
                      </div>
                  </div>
              </div>
         </div>
          
          <div id="modalProducts" className='modal fade' arial-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' arial-label='close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-file-signature'></i></span>  
                             <input type='text' id='nombre' className='form-control' placeholder='Nombre' value={nombre}
                              onchange={(e) => setnombre(e.target.value)}></input>
                        </div>

                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>  
                             <input type='text' id='descripcion' className='form-control' placeholder='Descripcion' value={descripcion}
                              onchange={(e) => setdescripcion(e.target.value)}></input>
                        </div>

                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>  
                             <input type='text' id='precio' className='form-control' placeholder='Precio' value={Precio}
                              onchange={(e) => setprecio(e.target.value)}></input>
                        </div>

                        

                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-socks'></i></span>  
                             <input type='number' id='stock' className='form-control' placeholder='Stock' value={Stock}
                              onchange={(e) => setstock(e.target.value)}></input>
                        </div>


                         <div className='d-grid col-6 mx-auto'>
                            <button onClick={()=> validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i>Guardar
                            </button>
                         </div>
                    </div>
                         
                         <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                         </div>
                    
                </div>
            </div>
        </div>
   </div>
 )
}

export default ShowProducts