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
import { FaLock, FaSave, FaSearch, FaPlus, FaEdit, FaTrash, FaStar, FaShieldAlt } from 'react-icons/fa';
import { Eye, EyeOff, X, User, Phone, MapPin as MapPinLucide, ShieldCheck, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useConfirmStore from '../../states/useConfirmStore';
import type { Map as LeafletMap } from 'leaflet';
import useNotify from '../../hooks/useNotify';

const VENEZUELA_GEO = {
  "Amazonas": ["Atures", "Atabapo", "Maroa", "Río Negro", "Autana", "Manapiare", "Alto Orinoco"],
  "Anzoátegui": ["Anaco", "Aragua", "Diego Bautista Urbaneja", "Fernando de Peñalver", "Francisco del Carmen Carvajal", "Francisco de Miranda", "Guanta", "Independencia", "José Gregorio Monagas", "Juan Antonio Sotillo", "Juan Manuel Cajigal", "Libertad", "Manuel Ezequiel Bruzual", "Pedro María Freites", "Píritu", "San José de Guanipa", "San Juan de Capistrano", "Santa Ana", "Simón Bolívar", "Simón Rodríguez", "Sir Arthur McGregor"],
  "Apure": ["Achaguas", "Biruaca", "Muñoz", "Páez", "Pedro Camejo", "Rómulo Gallegos", "San Fernando"],
  "Aragua": ["Bolívar", "Camatagua", "Francisco Linares Alcántara", "Girardot", "José Ángel Lamas", "José Félix Ribas", "José Rafael Revenga", "Libertador", "Mario Briceño Iragorry", "Ocumare de la Costa de Oro", "San Casimiro", "San Sebastián", "Santiago Mariño", "Santos Michelena", "Sucre", "Tovar", "Urdaneta", "Zamora"],
  "Barinas": ["Alberto Arvelo Torrealba", "Andrés Eloy Blanco", "Antonio José de Sucre", "Arismendi", "Barinas", "Bolívar", "Cruz Paredes", "Ezequiel Zamora", "Obispos", "Pedraza", "Rojas", "Sosa"],
  "Bolívar": ["Angostura", "Caroní", "Cedeño", "El Callao", "Gran Sabana", "Heres", "Padre Pedro Chien", "Piar", "Raúl Leoni", "Roscio", "Sifontes", "Sucre"],
  "Carabobo": ["Bejuma", "Carlos Arvelo", "Diego Ibarra", "Guacara", "Juan José Mora", "Libertador", "Los Guayos", "Miranda", "Montalbán", "Naguanagua", "Puerto Cabello", "San Diego", "San Joaquín", "Valencia"],
  "Cojedes": ["Anzoátegui", "Falcon", "Girardot", "Lima Blanco", "Pao de San Juan Bautista", "Ricaurte", "Rómulo Gallegos", "San Carlos", "Tinaco"],
  "Delta Amacuro": ["Antonio Díaz", "Casacoima", "Pedernales", "Tucupita"],
  "Distrito Capital": ["Libertador"],
  "Falcón": ["Acosta", "Bolívar", "Buchivacoa", "Cacique Manaure", "Carirubana", "Colina", "Dabajuro", "Democracia", "Falcón", "Federación", "Jacura", "Los Taques", "Mauroa", "Miranda", "Monseñor Iturriza", "Palmasola", "Petit", "Píritu", "San Francisco", "Silva", "Sucre", "Tocópero", "Unión", "Urumaco", "Zamora"],
  "Guárico": ["Camaguán", "Chaguaramas", "El Socorro", "Francisco de Miranda", "José Félix Ribas", "José Tadeo Monagas", "Juan Germán Roscio", "Julián Mellado", "Las Mercedes", "Leonardo Infante", "Ortiz", "Pedro Zaraza", "San Gerónimo de Guayabal", "San José de Guaribe", "Santa María de Ipire"],
  "Lara": ["Andrés Eloy Blanco", "Crespo", "Iribarren", "Jiménez", "Morán", "Palavecino", "Simón Planas", "Torres", "Urdaneta"],
  "Mérida": ["Alberto Adriani", "Andrés Bello", "Antonio Pinto Salinas", "Aricagua", "Arzobispo Chacón", "Campo Elías", "Caracciolo Parra Olmedo", "Cardenal Quintero", "Guaraque", "Julio César Salas", "Justo Briceño", "Libertador", "Miranda", "Obispo Ramos de Lora", "Padre Noguera", "Pueblo Llano", "Rangel", "Rivas Dávila", "Santos Marquina", "Sucre", "Tovar", "Tulio Febres Cordero", "Zea"],
  "Miranda": ["Andrés Bello", "Baruta", "Brión", "Buroz", "Carrizal", "Chacao", "Cristóbal Rojas", "El Hatillo", "Guaicaipuro", "Independencia", "Lander", "Los Salias", "Páez", "Paz Castillo", "Pedro Gual", "Plaza", "Simón Bolívar", "Sucre", "Urdaneta", "Zamora"],
  "Monagas": ["Acosta", "Aguasay", "Bolívar", "Caripe", "Cedeño", "Ezequiel Zamora", "Libertador", "Maturín", "Piar", "Punceres", "Santa Bárbara", "Sotillo", "Uracoa"],
  "Nueva Esparta": ["Antolín del Campo", "Arismendi", "Díaz", "García", "Gómez", "Maneiro", "Marcano", "Mariño", "Península de Macanao", "Tubores", "Villalba"],
  "Portuguesa": ["Agua Blanca", "Araure", "Esteller", "Guanare", "Guanarito", "Monseñor José Vicente de Unda", "Ospino", "Páez", "Papelón", "San Genaro de Boconoíto", "San Rafael de Onoto", "Santa Rosalía", "Sucre", "Turén"],
  "Sucre": ["Andrés Eloy Blanco", "Andrés Mata", "Arismendi", "Benítez", "Bermúdez", "Bolívar", "Cajigal", "Cruz Salmerón Acosta", "Libertador", "Mariño", "Mejía", "Montes", "Ribero", "Sucre", "Valdez"],
  "Táchira": ["Andrés Bello", "Antonio Rómulo Costa", "Ayacucho", "Bolívar", "Cárdenas", "Córdoba", "Fernández Feo", "Francisco de Miranda", "García de Hevia", "Guásimos", "Independencia", "Jáuregui", "José María Vargas", "Junín", "Libertad", "Libertador", "Lobatera", "Michelena", "Panamericano", "Pedro María Ureña", "Rafael Urdaneta", "Samuel Darío Maldonado", "San Cristóbal", "San Judas Tadeo", "Seboruco", "Simón Rodríguez", "Sucre", "Torbes", "Uribante"],
  "Trujillo": ["Andrés Bello", "Boconó", "Bolívar", "Candelaria", "Carache", "Escuque", "José Felipe Márquez Cañizales", "José Vicente Campo Elías", "La Ceiba", "Miranda", "Monte Carmelo", "Motatán", "Pampán", "Pampanito", "Rafael Rangel", "San Rafael de Carvajal", "Sucre", "Trujillo", "Urdaneta", "Valera"],
  "Vargas": ["Vargas"],
  "Yaracuy": ["Aristides Bastidas", "Bruwal", "Cocorote", "Independencia", "José Antonio Páez", "La Trinidad", "Manuel Monge", "Nirgua", "Peña", "San Felipe", "Sucre", "Urachiche", "Veroes", "Yaritagua"],
  "Zulia": ["Almirante Padilla", "Baralt", "Cabimas", "Catatumbo", "Colón", "Francisco Javier Pulgar", "Jesús Enrique Lossada", "Jesús María Semprún", "La Cañada de Urdaneta", "Lagunillas", "Machiques de Perijá", "Mara", "Maracaibo", "Miranda", "Páez", "Rosario de Perijá", "San Francisco", "Santa Rita", "Simón Bolívar", "Sucre", "Valmore Rodríguez"]
};

const Profile = () => {
  const { user, setUser } = useStore();
  const { notify } = useNotify();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
const mapRef = useRef<LeafletMap | null>(null);

  // Interfaz para direcciones
  interface Address {
    id: string;
    address: string;
    coordinates: [number, number];
    state?: string;
    municipality?: string;
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
  const [, setShowMap] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Estado para loader
  const [noResults, setNoResults] = useState(false); // Estado para "sin resultados"
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');
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
      coordinates: [10.4806, -66.9036], // Caracas por defecto
      state: '',
      municipality: ''
    };

    setEditingAddress(tempAddress);
    setLocation(tempAddress.coordinates);
    setAddressResult(tempAddress.address);
    setSearchQuery(tempAddress.address);
    setSelectedState('');
    setSelectedMunicipality('');
    setShowMap(true);
  };

  // Función para editar una dirección existente
  const editAddress = (address: Address) => {
    setEditingAddress(address);
    setLocation(address.coordinates);
    setAddressResult(address.address);
    setSearchQuery(address.address);
    setSelectedState(address.state || '');
    setSelectedMunicipality(address.municipality || '');
    setShowMap(true);
  };

  // Función para guardar la dirección actual (nueva o editada)
  const saveCurrentAddress = () => {
    if (!editingAddress) return;

    const updatedAddress: Address = {
      id: editingAddress.id,
      address: addressResult,
      coordinates: location,
      state: selectedState,
      municipality: selectedMunicipality
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

    if (!hasUnsavedChanges) {
      notify.info('Recuerda guardar los cambios al finalizar');
    }
    setHasUnsavedChanges(true);
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

    if (!hasUnsavedChanges) {
      notify.info('Recuerda guardar los cambios al finalizar');
    }
    setHasUnsavedChanges(true);

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
    if (!hasUnsavedChanges) {
      notify.info('Recuerda guardar los cambios al finalizar');
    }
    setHasUnsavedChanges(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (!hasUnsavedChanges) {
      notify.info('Recuerda guardar los cambios al finalizar');
    }
    setHasUnsavedChanges(true);
  };

  // Función para buscar direcciones (geocoding) con múltiples resultados y lógica de búsqueda avanzada
  const searchAddress = async (query: string, limitToViewbox: boolean = false) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      setNoResults(false);
      return;
    }

    setIsSearching(true);
    setNoResults(false);

    try {
      // Normalización básica de la consulta
      const normalizedQuery = query.trim()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ");

      const fetchNominatim = async (q: string, extraParams: string = '') => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=15&addressdetails=1&namedetails=1&countrycodes=ve${extraParams}`;
        const response = await fetch(url, {
          headers: {
            'Accept-Language': 'es'
          }
        });
        return await response.json();
      };

      let extraParams = '';
      if (limitToViewbox && mapRef.current) {
        const bounds = mapRef.current.getBounds();
        const viewbox = `${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()},${bounds.getSouth()}`;
        extraParams = `&viewbox=${viewbox}&bounded=1`;
      }

      // TIER 1: Búsqueda estructurada completa (si hay filtros seleccionados)
      let results = [];
      if (selectedState || selectedMunicipality) {
        let structuredQ = normalizedQuery;
        if (selectedMunicipality) structuredQ += `, ${selectedMunicipality}`;
        if (selectedState) structuredQ += `, ${selectedState}`;
        
        results = await fetchNominatim(structuredQ, extraParams);
      }

      // TIER 2: Si no hay resultados o no hay filtros, búsqueda relajada (solo con estado)
      if (results.length === 0 && selectedState) {
        results = await fetchNominatim(`${normalizedQuery}, ${selectedState}`, extraParams);
      }

      // TIER 3: Búsqueda global en Venezuela (Fuzzy fallback)
      if (results.length === 0) {
        results = await fetchNominatim(normalizedQuery, extraParams);
      }

      if (Array.isArray(results) && results.length > 0) {
        setSearchResults(results);
        setShowResults(true);
        setNoResults(false);
      } else {
        setSearchResults([]);
        setShowResults(false);
        setNoResults(true);
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Función para geocodificar y posicionar mapa basado en Estado o Municipio
  const geocodeAndCenter = async (state: string, municipality: string = '') => {
    try {
      let query = '';
      if (municipality) query = `${municipality}, ${state}, Venezuela`;
      else query = `${state}, Venezuela`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=ve`,
        { headers: { 'Accept-Language': 'es' } }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCoords: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setLocation(newCoords);
        
        // Centrar el mapa con animación
        if (mapRef.current) {
          mapRef.current.setView(newCoords, municipality ? 14 : 10);
        }
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
  };

  // Manejar cambio en el input de búsqueda con debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Limpiar timeout anterior
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }

    // Buscar en tiempo real con debounce de 500ms
    if (value.trim()) {
      setNoResults(false);
      window.searchTimeout = setTimeout(() => {
        searchAddress(value, true); // Pasar true para acotar a la vista actual del mapa
      }, 500);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setNoResults(false);
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

  // Activar búsqueda cuando cambian los filtros si hay texto en el buscador
  useEffect(() => {
    if (searchQuery.trim() && editingAddress) {
      searchAddress(searchQuery);
    }
  }, [selectedState, selectedMunicipality]);

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

  // Componente para corregir el tamaño del mapa al cargar y cuando cambia el estado
  const ResizeMap = () => {
    const map = useMap();
    useEffect(() => {
      const resize = () => {
        // Ejecutar inmediatamente y después de varios intervalos para asegurar la carga en móviles
        map.invalidateSize();
        [100, 300, 500, 1000].forEach(delay => {
          setTimeout(() => map.invalidateSize(), delay);
        });
      };
      
      resize();
      window.addEventListener('resize', resize);
      // También ejecutar cuando cambie la orientación del dispositivo (común en móviles)
      window.addEventListener('orientationchange', resize);
      
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('orientationchange', resize);
      };
    }, [map]);
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

  const handleUpdateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;

    setLoading(true);

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

      setHasUnsavedChanges(false);
      notify.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      notify.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify.error('Las contraseñas nuevas no coinciden');
      return;
    }

    setPasswordLoading(true);

    try {
      await request.put(`${apiUrl}/users/${user.id}/password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      notify.success('Contraseña actualizada exitosamente');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      notify.error(error.response?.data?.message || 'Error al actualizar la contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header de la Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <User className="w-8 h-8 text-red-600" />
            </div>
            Mi Perfil
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Gestiona tu información personal y de seguridad</p>
        </div>
      </div>

      {/* Notificación de Cambios Pendientes (Arriba) */}
      {hasUnsavedChanges && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 shadow-sm ring-4 ring-amber-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-black text-amber-900 uppercase tracking-wider">Cambios sin guardar</p>
                <p className="text-xs font-bold text-amber-700">
                  Has realizado modificaciones. No olvides pulsar el botón de guardado al final de la página.
                </p>
              </div>
            </div>
            {/* <button 
              onClick={() => {
                const element = document.getElementById('save-button-container');
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="hidden md:block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl transition-all active:scale-95 uppercase tracking-widest shadow-md shadow-amber-200"
            >
              Ir a Guardar
            </button> */}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Información Personal y Direcciones */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card: Datos Personales */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h2 className="text-xl font-black text-gray-900">Datos Personales</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" /> Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Tu nombre completo"
                      className="w-full px-5 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" /> Teléfono
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Ej: +58 412 1234567"
                      className="w-full px-5 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Card: Direcciones */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                  <h2 className="text-xl font-black text-gray-900">Direcciones de Envío</h2>
                </div>
                <button
                  type="button"
                  onClick={addAddress}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all group active:scale-95 font-bold text-sm"
                >
                  <FaPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden sm:inline">Nueva Dirección</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.addresses.filter(address => address.address.trim() !== '').length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] md:rounded-3xl p-6 md:p-10 text-center">
                    <div className="bg-white w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm ring-4 ring-gray-50">
                      <MapPinLucide className="text-gray-300 w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <h3 className="text-gray-900 font-black text-lg md:text-xl">Sin direcciones</h3>
                    <p className="text-gray-500 text-xs md:text-sm mt-2 md:mt-3 font-medium max-w-xs mx-auto leading-relaxed">
                      Agrega tu primera dirección para que tus entregas sean más rápidas y precisas.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {formData.addresses
                      .filter(address => address.address.trim() !== '')
                      .map((address) => (
                        <div 
                          key={address.id} 
                          className={`group relative border-2 rounded-[1.5rem] p-4 transition-all duration-300 ${
                            address.primary 
                              ? 'bg-red-50/20 border-red-100' 
                              : 'bg-white border-gray-50 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50'
                          }`}
                        >
                          <div className="flex flex-col justify-between items-start gap-4">
                            <div className="flex-1 min-w-0 w-full">
                              <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-xl ${address.primary ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <MapPinLucide className="w-5 h-5" />
                                  </div>
                                  {address.primary && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-100/50 px-3 py-1 rounded-full border border-red-100">
                                      Principal
                                    </span>
                                  )}
                                </div>

                                {/* Botones de acción siempre visibles en la esquina superior derecha */}
                                <div className="flex items-center gap-1">
                                  {!address.primary && (
                                    <button
                                      type="button"
                                      onClick={() => setAsPrimary(address.id)}
                                      className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-xl transition-all active:scale-90"
                                      title="Marcar como principal"
                                    >
                                      <FaStar className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => editAddress(address)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                                    title="Editar"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteAddress(address.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                    title="Eliminar"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm font-bold text-gray-900 leading-relaxed break-words">
                                {address.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Seguridad */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-8">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h2 className="text-xl font-black text-gray-900">Seguridad</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <FaLock className="w-3.5 h-3.5 text-gray-400" /> Contraseña Actual
                  </label>
                  <div className="relative group">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="••••••••"
                      className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <FaShieldAlt className="w-3.5 h-3.5 text-gray-400" /> Nueva Contraseña
                  </label>
                  <div className="relative group">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> Confirmar Nueva
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Repite tu nueva contraseña"
                      className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full mt-4 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                >
                  {passwordLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FaLock className="w-4 h-4" />
                  )}
                  {passwordLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Botón General de Actualización */}
      <div id="save-button-container" className="flex justify-center md:justify-end pt-8 border-t border-gray-100">
        <button
          type="button"
          onClick={() => handleUpdateProfile()}
          disabled={loading}
          className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-16 py-5 rounded-[2rem] font-black shadow-2xl shadow-gray-200 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95 text-xl"
        >
          {loading ? (
            <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FaSave className="w-7 h-7" />
          )}
          {loading ? 'Guardando cambios...' : 'Guardar Información'}
        </button>
      </div>

      {/* Reutilización del Modal Existente */}
      {editingAddress && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-white w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 h-[85vh] md:h-[80vh] flex flex-col"
          >
            {/* Header del Modal */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 truncate flex items-center gap-2">
                  <div className="p-1.5 bg-red-100 rounded-lg">
                    <MapPinLucide className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                  </div>
                  {formData.addresses.some(addr => addr.id === editingAddress.id) ? 'Editar Ubicación' : 'Nueva Ubicación'}
                </h2>
              </div>
              <button
                onClick={() => setEditingAddress(null)}
                className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-500 flex-shrink-0 active:scale-90"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Body del Modal */}
            <div className="flex-1 p-3 md:p-6 flex flex-col overflow-y-auto custom-scrollbar">
              <div className="flex-1 flex flex-col min-h-0">
                {/* Filtros de Estado y Municipio */}
                <div className="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider ml-1">Estado</label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setSelectedState(newState);
                        setSelectedMunicipality(''); // Reset municipio al cambiar estado
                        if (newState) {
                          geocodeAndCenter(newState);
                        }
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900 shadow-sm text-xs appearance-none cursor-pointer"
                    >
                      <option value="">Todos los estados</option>
                      {Object.keys(VENEZUELA_GEO).sort().map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider ml-1">Municipio</label>
                    <select
                      value={selectedMunicipality}
                      onChange={(e) => {
                        const newMuni = e.target.value;
                        setSelectedMunicipality(newMuni);
                        if (newMuni && selectedState) {
                          geocodeAndCenter(selectedState, newMuni);
                        }
                      }}
                      disabled={!selectedState}
                      className="w-full px-3 py-2 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900 shadow-sm text-xs appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Todos los municipios</option>
                      {selectedState && VENEZUELA_GEO[selectedState as keyof typeof VENEZUELA_GEO].sort().map(muni => (
                        <option key={muni} value={muni}>{muni}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Buscador y Resultados */}
                <div className="mb-3 md:mb-4 space-y-3 md:space-y-4 flex-shrink-0">
                  <div className="space-y-2">
                    <div className="relative z-[10000]">
                      <div className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => {
                            if (searchQuery.trim()) {
                              searchAddress(searchQuery);
                            }
                          }}
                          placeholder="Buscar calle, sector o punto de referencia..."
                          className="w-full pl-12 pr-12 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-bold text-gray-900 shadow-sm text-sm"
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setSearchResults([]);
                              setShowResults(false);
                              setNoResults(false);
                              if (searchInputRef.current) searchInputRef.current.focus();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* Dropdown de resultados */}
                        {isSearching ? (
                          <div className="absolute z-[99999] mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl p-4 text-center animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-center gap-2 text-gray-500 font-bold text-xs">
                              <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                              Buscando...
                            </div>
                          </div>
                        ) : showResults && searchResults.length > 0 ? (
                          <div
                            ref={resultsContainerRef}
                            className="absolute z-[99999] mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 custom-scrollbar"
                          >
                            {searchResults.map((result, index) => (
                              <div
                                key={index}
                                onClick={() => handleSelectAddress(result)}
                                className="px-4 py-3 cursor-pointer hover:bg-red-50 transition-colors text-xs font-bold text-gray-700 border-b border-gray-50 last:border-b-0 flex items-start gap-2 group"
                              >
                                <MapPinLucide className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="whitespace-normal break-words flex-1 group-hover:text-red-700 transition-colors">{result.display_name}</span>
                              </div>
                            ))}
                          </div>
                        ) : noResults && searchQuery.trim() && (
                          <div className="absolute z-[99999] mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl p-6 text-center animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-3 bg-gray-50 rounded-full">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-black text-gray-900">Sin resultados</p>
                                <p className="text-[10px] font-bold text-gray-500 leading-relaxed px-4">
                                  No pudimos encontrar "{searchQuery}". Intenta con términos más generales o mueve el marcador directamente en el mapa.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resultado Seleccionado */}
                  {addressResult && (
                    <div className="p-3 bg-green-50/50 border border-green-100 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black text-green-700 uppercase tracking-wider">Confirmada</p>
                        <p className="text-xs font-bold text-green-900 whitespace-normal break-words">{addressResult}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mapa */}
                <div className="relative border-2 border-gray-50 rounded-2xl overflow-hidden flex-1 min-h-[300px] shadow-inner group bg-[#f8f9fa]">
                  <MapContainer
                    center={location}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                    fadeAnimation={true}
                    markerZoomAnimation={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      detectRetina={true}
                      maxNativeZoom={19}
                      maxZoom={20}
                      updateWhenIdle={false}
                      updateWhenZooming={false}
                      keepBuffer={4}
                    />
                    <MapEvents />
                    <MapCenterer />
                    <ResizeMap />
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
                      <Popup className="custom-popup">
                        <div className="p-1 font-bold">Tu entrega llegará aquí</div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                  <div className="absolute bottom-2 left-2 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500 shadow-sm border border-gray-100">
                    Mueve el marcador a tu direccion exacta
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingAddress(null)}
                className="flex-1 px-4 py-3 rounded-xl font-black text-gray-500 hover:bg-gray-200 transition-all active:scale-95 text-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveCurrentAddress}
                disabled={!addressResult.trim()}
                className="flex-[2] bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-xl font-black shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm"
              >
                <FaSave className="w-4 h-4" />
                <span>{formData.addresses.some(addr => addr.id === editingAddress.id) ? 'Actualizar' : 'Confirmar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
