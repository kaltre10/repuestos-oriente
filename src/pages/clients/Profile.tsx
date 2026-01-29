// Declaración global para searchTimeout
declare global {
  interface Window {
    searchTimeout: ReturnType<typeof setTimeout> | undefined;
  }
}

import { useState, useEffect, useRef } from 'react';
import useStore from '../../states/global';
import request from '../../utils/request';
import { apiUrl } from '../../utils/utils';
import { FaUser, FaPhone, FaMapMarkerAlt, FaLock, FaSave, FaSearch, FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useConfirmStore from '../../states/useConfirmStore';

const Profile = () => {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Interfaz para direcciones
  interface Address {
    id: string;
    address: string;
    coordinates: [number, number];
    primary?: boolean;
  }

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addresses: [] as Address[],
  });

  // Mapa state
  const [location, setLocation] = useState<[number, number]>([10.4806, -66.9036]); // Default: Caracas
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [addressResult, setAddressResult] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Estado para loader
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      // Inicializar con direcciones existentes o una dirección por defecto si no hay ninguna
      let initialAddresses: Address[] = [];

      // Intentar parsear user.address si es una cadena JSON
      if (typeof user.address === 'string' && user.address) {
        try {
          const parsedAddress = JSON.parse(user.address);
          if (Array.isArray(parsedAddress)) {
            initialAddresses = parsedAddress;
          }
        } catch (error) {
          // Si no es un JSON válido, usar la dirección como texto plano
          initialAddresses = [{
            id: Date.now().toString(),
            address: user.address,
            coordinates: [10.4806, -66.9036] // Caracas por defecto
          }];
        }
      }
      // Si no hay direcciones, usar una dirección por defecto
      else {
        initialAddresses = [{
          id: Date.now().toString(),
          address: user.address || '',
          coordinates: [10.4806, -66.9036] // Caracas por defecto
        }];
      }

      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        addresses: initialAddresses,
      });
    }
  }, [user]);

  // Función para agregar una nueva dirección
  const addAddress = () => {
    // Crear dirección temporal para edición, no agregarla al formData todavía
    const tempAddress: Address = {
      id: Date.now().toString(),
      address: '',
      coordinates: [10.4806, -66.9036] // Caracas por defecto
    };

    setEditingAddress(tempAddress);
    setLocation(tempAddress.coordinates);
    setAddressResult(tempAddress.address);
    setSearchQuery(tempAddress.address);
    setShowMap(true);
  };

  // Función para editar una dirección existente
  const editAddress = (address: Address) => {
    setEditingAddress(address);
    setLocation(address.coordinates);
    setAddressResult(address.address);
    setSearchQuery(address.address);
    setShowMap(true);
  };

  // Función para guardar la dirección actual (nueva o editada)
  const saveCurrentAddress = () => {
    if (!editingAddress) return;

    const updatedAddress: Address = {
      id: editingAddress.id,
      address: addressResult,
      coordinates: location
    };

    // Verificar si la dirección ya existe en el formData
    const exists = formData.addresses.some(addr => addr.id === updatedAddress.id);

    setFormData(prev => ({
      ...prev,
      addresses: exists
        ? prev.addresses.map(addr =>
          addr.id === updatedAddress.id ? updatedAddress : addr
        )
        : [...prev.addresses, updatedAddress]
    }));

    setEditingAddress(null);
  };

  // Función para eliminar una dirección
  const deleteAddress = async (addressId: string) => {
    // Usar modal de confirmación antes de eliminar
    const confirmed = await useConfirmStore.getState().ask('¿Estás seguro de que deseas eliminar esta dirección?');

    if (!confirmed) return;

    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr.id !== addressId)
    }));

    // Si se está editando la dirección que se está eliminando, limpiar el estado
    if (editingAddress?.id === addressId) {
      setEditingAddress(null);
      setLocation([10.4806, -66.9036]);
      setAddressResult('');
      setSearchQuery('');
    }
  };

  // Función para establecer una dirección como principal
  const setAsPrimary = (addressId: string) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => ({
        ...addr,
        primary: addr.id === addressId
      }))
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para buscar direcciones (geocoding) con múltiples resultados
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true); // Iniciar loader

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=ve`
      );
      const data = await response.json();

      console.log('Search results:', data);

      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
        setShowResults(true);
        console.log('Show results set to true');
      } else {
        setSearchResults([]);
        setShowResults(false);
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false); // Finalizar loader
    }
  };

  // Manejar cambio en el input de búsqueda con debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Mostrar el mapa automáticamente al empezar a escribir
    if (value.trim() && !showMap) {
      setShowMap(true);
    }

    // Limpiar timeout anterior
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }

    // Buscar en tiempo real con debounce de 500ms
    if (value.trim()) {
      window.searchTimeout = setTimeout(() => {
        searchAddress(value);
      }, 500);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Manejar selección de dirección de los resultados
  const handleSelectAddress = (result: { display_name: string; lat: string; lon: string }) => {
    const newLocation: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
    setLocation(newLocation);
    setAddressResult(result.display_name);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    setShowResults(false);

    // Si se está editando una dirección, actualizarla
    if (editingAddress) {
      const updatedAddress: Address = {
        ...editingAddress,
        address: result.display_name,
        coordinates: newLocation
      };

      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr =>
          addr.id === updatedAddress.id ? updatedAddress : addr
        )
      }));

      setEditingAddress(updatedAddress);
    }
  };

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        resultsContainerRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        !resultsContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Efecto para depurar los estados
  useEffect(() => {
    console.log('showResults:', showResults);
    console.log('searchResults length:', searchResults.length);
  }, [showResults, searchResults]);

  // Componente para manejar eventos del mapa
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newLocation: [number, number] = [e.latlng.lat, e.latlng.lng];
        setLocation(newLocation);

        // Obtener dirección de la ubicación seleccionada (reverse geocoding)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&countrycodes=ve`
        )
          .then(response => response.json())
          .then(data => {
            if (data && data.display_name) {
              setAddressResult(data.display_name);
              setSearchQuery(data.display_name); // Actualizar el input de búsqueda
            }
          })
          .catch(error => {
            console.error('Error getting address:', error);
          });
      },
    });
    return null;
  };

  // Componente para centrar el mapa en la ubicación actual
  const MapCenterer = () => {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.panTo(location);
      }
    }, [location, map]);
    return null;
  };

  // Función para actualizar la ubicación al mover el marcador
  const handleMarkerDrag = (e: any) => {
    const newLocation: [number, number] = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    setLocation(newLocation);

    // Obtener dirección de la nueva ubicación
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation[0]}&lon=${newLocation[1]}&countrycodes=ve`
    )
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          setAddressResult(data.display_name);
          setSearchQuery(data.display_name); // Actualizar el input de búsqueda
        }
      })
      .catch(error => {
        console.error('Error getting address:', error);
      });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Preparar los datos para enviar al servidor
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        address: JSON.stringify(formData.addresses)
      };

      const response = await request.put(`${apiUrl}/users/${user.id}`, profileData);
      const updatedUser = response.data.body.user;
      const newUserState = { ...user, ...updatedUser };

      // Update local storage
      localStorage.setItem('user', JSON.stringify(newUserState));

      // Update global store
      setUser(newUserState);

      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al actualizar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    setPasswordLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await request.put(`${apiUrl}/users/${user.id}/password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage({ type: 'success', text: 'Contraseña actualizada exitosamente' });
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al actualizar la contraseña'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="pb-8">
        <div className="border-b border-gray-300 pb-3 mb-3">
          <h2 className="text-xl font-bold text-gray-600 flex items-center gap-2">
            <FaUser /> Mi Perfil
          </h2>
        </div>

        <div className="">
          {message.text && (
            <div className={`mb-6 p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-gray-400" /> Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-gray-400" /> Teléfono
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Ej: +58 412 1234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : <><FaSave /> Guardar Cambios</>}
              </button>
            </div> <hr className='border-gray-300 my-6' />

            <div className="col-span-1 md:col-span-2">
              <div className='flex justify-between w-full rounded-lg mb-6'>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" /> Direcciones de Envío
                </label>

                {/* Botón de agregar dirección debajo del título */}
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={addAddress}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <FaPlus className="h-4 w-4" />
                    Agregar Dirección
                  </button>
                </div>
              </div>

              {/* Lista de direcciones */}
              <div className="mb-6 space-y-3">
                {formData.addresses
                  .filter(address => address.address.trim() !== '')
                  .map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-white">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <p className="text-sm text-gray-600 line-clamp-3">{address.address}</p>
                            {address.primary && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 mt-0.5 whitespace-nowrap">
                                <FaStar className="h-3 w-3" /> Principal
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Botones de acción con iconos */}
                        <div className="flex gap-2">
                          {/* Botón Principal */}
                          <button
                            type="button"
                            onClick={() => setAsPrimary(address.id)}
                            title={address.primary ? "Ya es principal" : "Establecer como principal"}
                            className={`p-2 rounded-full transition-all duration-200 ${address.primary ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                            disabled={address.primary}
                          >
                            <FaStar className="h-5 w-5" />
                          </button>

                          {/* Botón Editar */}
                          <button
                            type="button"
                            onClick={() => editAddress(address)}
                            title="Editar dirección"
                            className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>

                          {/* Botón Eliminar */}
                          <button
                            type="button"
                            onClick={() => deleteAddress(address.id)}
                            title="Eliminar dirección"
                            className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Formulario para agregar/editar dirección */}
              {editingAddress && (
                <div className="border border-gray-200 rounded-xl p-6 mb-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      {formData.addresses.some(addr => addr.id === editingAddress.id) ? (
                        <>Editar Dirección</>
                      ) : (
                        <>Crear Dirección</>
                      )}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingAddress(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                      title="Cancelar edición"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar dirección
                      </label>
                      {/* Contenedor principal con z-index muy alto */}
                      <div className="relative z-[10000]">
                        {/* Input de búsqueda de dirección con dropdown */}
                        <div className="relative">
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Buscar dirección..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md"
                          />
                          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

                          {/* Dropdown de resultados - Asegurado por encima del mapa */}
                          {isSearching ? (
                            <div
                              className="absolute z-[99999] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl"
                              style={{
                                zIndex: 99999,
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                                margin: '0.25rem 0 0 0',
                                width: '100%',
                                boxSizing: 'border-box',
                                pointerEvents: 'auto',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                              }}
                            >
                              <div className="px-4 py-3 flex items-center justify-center text-sm text-gray-500">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Buscando direcciones...
                              </div>
                            </div>
                          ) : showResults && searchResults.length > 0 && (
                            <div
                              ref={resultsContainerRef}
                              className="absolute z-[99999] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                              style={{
                                zIndex: 99999,
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                                maxHeight: '15rem',
                                overflowY: 'auto',
                                margin: '0.25rem 0 0 0',
                                width: '100%',
                                boxSizing: 'border-box',
                                pointerEvents: 'auto',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                              }}
                            >
                              {searchResults.map((result, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleSelectAddress(result)}
                                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-sm border-b border-gray-100 last:border-b-0"
                                >
                                  {result.display_name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Resultado de la dirección */}
                    {addressResult && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            <strong>Dirección seleccionada:</strong> {addressResult}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Mapa */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden h-80 shadow-sm">
                      <MapContainer
                        center={location}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapEvents />
                        <MapCenterer />
                        <Marker
                          position={location}
                          draggable={true}
                          eventHandlers={{ dragend: handleMarkerDrag }}
                          icon={L.icon({
                            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                          })}
                        >
                          <Popup>
                            <div>
                              <h3 className="font-semibold text-sm">Tu ubicación</h3>
                              <p className="text-xs">{addressResult || 'Selecciona una ubicación'}</p>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>

                  {/* Botones para guardar o cancelar */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingAddress(null)}
                      className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 shadow-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={saveCurrentAddress}
                      className="bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Guardar Dirección
                    </button>
                  </div>
                </div>
              )}
            </div>


          </form>
        </div>
      </div>

      <div className="">
        <div className="py-4 border-b border-gray-300 pb-3 mb-3">
          <h2 className="text-xl font-bold text-gray-600 flex items-center gap-2">
            <FaLock /> Cambiar Contraseña
          </h2>
        </div>

        <div className="">
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {passwordLoading ? 'Actualizando...' : <><FaLock /> Actualizar Contraseña</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
