import axios from 'axios';

const apiUrl = 'http://localhost:3001/api/v1';

// Test para crear un tipo de pago con propiedades
async function testPaymentType() {
  try {
    console.log('=== Test de Tipo de Pago ===');
    
    // 1. Crear un tipo de pago con propiedades
    console.log('1. Creando tipo de pago con propiedades...');
    const createResponse = await axios.post(`${apiUrl}/payment-types`, {
      name: 'Test Payment Type',
      properties: ['Banco', 'Cuenta', 'Titular']
    });
    
    console.log('✓ Tipo de pago creado:', createResponse.data.body.paymentType);
    
    const paymentTypeId = createResponse.data.body.paymentType.id;
    
    // 2. Obtener el tipo de pago creado
    console.log('\n2. Obteniendo tipo de pago creado...');
    const getResponse = await axios.get(`${apiUrl}/payment-types`);
    const paymentType = getResponse.data.body.paymentTypes.find(type => type.id === paymentTypeId);
    
    console.log('✓ Tipo de pago obtenido:', paymentType);
    console.log('✓ Propiedades:', paymentType.properties);
    console.log('✓ Tipo de propiedades:', typeof paymentType.properties);
    console.log('✓ Es array:', Array.isArray(paymentType.properties));
    
    // 3. Actualizar el tipo de pago con más propiedades
    console.log('\n3. Actualizando tipo de pago con más propiedades...');
    const updateResponse = await axios.put(`${apiUrl}/payment-types/${paymentTypeId}`, {
      name: 'Test Payment Type Updated',
      properties: ['Banco', 'Cuenta', 'Titular', 'CI/RIF']
    });
    
    console.log('✓ Tipo de pago actualizado:', updateResponse.data.body.paymentType);
    console.log('✓ Propiedades actualizadas:', updateResponse.data.body.paymentType.properties);
    
    // 4. Obtener todos los tipos de pago
    console.log('\n4. Obteniendo todos los tipos de pago...');
    const getAllResponse = await axios.get(`${apiUrl}/payment-types`);
    console.log('✓ Todos los tipos de pago:', getAllResponse.data.body.paymentTypes);
    
    // 5. Eliminar el tipo de pago de prueba
    console.log('\n5. Eliminando tipo de pago de prueba...');
    await axios.delete(`${apiUrl}/payment-types/${paymentTypeId}`);
    console.log('✓ Tipo de pago eliminado');
    
    console.log('\n=== Test completado exitosamente! ===');
    
  } catch (error) {
    console.error('Error en el test:', error.response ? error.response.data : error.message);
  }
}

testPaymentType();
