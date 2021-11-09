import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { FaSistrix } from 'react-icons/fa';
import {
  Main, ScreenContainer, ScreenTitle, ScreenSearch, ScreenContentBox,
  ScreenHeader, ScreenList, Dropdown, DropdownField, styles,
} from './Style';
import SearchInput from '../../Components/SearchInput';
import DemandData from '../../Components/DemandData';
import { getDemandsWithClientsNames, getCategories } from '../../Services/Axios/demandsServices';
import { getSectors } from '../../Services/Axios/sectorServices';
import DropdownComponent from '../../Components/DropdownComponent';
import colors from '../../Constants/colors';
import { useProfileUser } from '../../Context';

const ListDemandsScreen = () => {
  const { token, user } = useProfileUser();
  const [word, setWord] = useState();
  const [filterDemands, setFilterDemands] = useState([]);
  const [filterSector, setFilterSector] = useState(['todos']);
  const [filterCategory, setFilterCategory] = useState(['Todas']);
  const [demands, setDemands] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [dropdownYears, setDropdownYears] = useState([]);
  const [filterYear, setFilterYear] = useState('Sem filtro');
  const [categories, setCategories] = useState([]);
  const [sectorActive, setSectorActive] = useState('todos');
  const [categoryActive, setCategoryActive] = useState('Todas');
  const [active, setActive] = useState('Ativos');
  const [query, setQuery] = useState(true);
  const { startModal } = useProfileUser();

  const getDemandsFromApi = async () => {
    // Por default, traz como resultado somente as demandas ativas,
    // de todos os setores, de todas as categorias
    await getDemandsWithClientsNames(`clientsNames?open=${query}&sectorActive=${sectorActive}`, startModal)
      .then((response) => {
        setDemands(response.data);
      });
  };

  const getSectorsFromApi = async () => {
    await getSectors(startModal)
      .then((response) => {
        setSectors(response?.data);
        setSectorActive(response?.data[0]?.name);
      });
  };
  const getCategoriesFromApi = async () => {
    await getCategories('category', startModal)
      .then((response) => {
        setCategories(response.data);
      });
    setSectorActive('todos');
  };

  const filterDemandByYear = () => {
    const filteredDemands = [];
    demands.filter((demand) => {
      const year = new Date(demand.createdAt).getFullYear().toString();
      if (year === filterYear) {
        filteredDemands.push(demand);
      }
      return undefined;
    });
    setFilterDemands(filteredDemands);
  };

  const listYears = () => {
    const years = ['Sem filtro'];
    demands?.map((demand) => {
      const year = new Date(demand.createdAt).getFullYear();
      if (!years.find((y) => y === year)) {
        years.push(year);
      }
      return undefined;
    });
    setDropdownYears(years);
  };

  useEffect(() => {
    if (token && user) {
      getDemandsFromApi();
      getSectorsFromApi();
      getCategoriesFromApi();
    }
  }, [token, user]);

  useEffect(() => {
    setFilterDemands(
      demands.filter((demand) => demand.name.toLowerCase().includes(word?.toLowerCase())
        || demand.clientName.toLowerCase().includes(word?.toLowerCase())
        || demand.process.toLowerCase().includes(word?.toLowerCase())),
    );
  }, [word]);

  useEffect(() => {
    if (active === 'Inativas') {
      setQuery(false);
    } else if (active === 'Todas') {
      setQuery(null);
    } else {
      setQuery(true);
    }
  }, [active]);

  useEffect(() => {
    if (!dropdownYears.find((ano) => (ano === filterYear))) {
      setFilterYear('Sem filtro');
    }
    getDemandsFromApi();
    if (filterYear !== 'Sem filtro') {
      filterDemandByYear();
    } else {
      setFilterDemands(demands);
    }
  }, [query]);

  useEffect(() => {
    setFilterDemands(demands);
    listYears();
  }, [demands]);

  useEffect(() => {
    setFilterSector([{ name: 'todos' }, ...sectors]);
  }, [sectors]);

  useEffect(() => {
    if (filterYear !== 'Sem filtro') {
      filterDemandByYear();
    } else {
      setFilterDemands(demands);
    }
  }, [filterYear]);

  useEffect(() => {
    setFilterCategory([...filterCategory, ...categories]);
  }, [categories]);

  const listDemands = () => {
    if (demands?.length === 0 || filterDemands?.length === 0) {
      return <h1>Sem resultados para esses filtros</h1>;
    }
    return filterDemands?.map((demand) => {
      const sector = filterSector?.filter(
        (listSector) => (listSector.name === sectorActive ? listSector : false),
      );

      if (sectorActive !== 'todos') {
        if (demand.sectorHistory[demand.sectorHistory.length - 1].sectorID !== sector[0]?._id) {
          return false;
        }
      }

      if (categoryActive !== 'Todas') {
        const results = demand.categoryID.filter(
          (demandCategory) => (demandCategory.name === categoryActive ? demandCategory : false),
        );
        if (results.length === 0) {
          return false;
        }
      }
      return (
        <DemandData
          sector={sector}
          demand={demand}
          key={demand._id}
          sectors={sectors}
        />
      );
    });
  };

  if (!localStorage.getItem('@App:token')) {
    return <Redirect to="/login" />;
  }

  return (
    <Main>
      {user && demands ? (
        <ScreenContainer>
          <ScreenTitle>Demandas</ScreenTitle>
          <ScreenHeader>
            <ScreenSearch>
              <SearchInput
                type="text"
                icon={<FaSistrix />}
                value={word}
                setWord={(value) => setWord(value)}
                style={{ width: '100%' }}
              />
            </ScreenSearch>
            <Dropdown>
              <DropdownField>
                <p style={{ marginBottom: '0' }}>Status: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setActive(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={['Ativas', 'Inativas', 'Todas']}
                />
              </DropdownField>
              <DropdownField width="25%">
                <p style={{ marginBottom: '0' }}>Setores:</p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setSectorActive(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={filterSector?.map((sector) => sector.name)}
                />
              </DropdownField>
              <DropdownField width="25%">
                <p style={{ marginBottom: '0' }}>Categoria: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setCategoryActive(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={filterCategory?.map(
                    (category) => (category.name ? category.name : category),
                  )}
                />
              </DropdownField>
              <DropdownField>
                <p style={{ marginBottom: '0' }}>Anos: </p>
                <DropdownComponent
                  OnChangeFunction={(Option) => setFilterYear(Option.target.value)}
                  style={styles.dropdownComponentStyle}
                  optionStyle={{
                    backgroundColor: `${colors.secondary}`,
                  }}
                  optionList={dropdownYears}
                />
              </DropdownField>
            </Dropdown>
          </ScreenHeader>
          <ScreenContentBox>
            <ScreenList>
              {listDemands()}
            </ScreenList>
          </ScreenContentBox>
        </ScreenContainer>
      ) : <h1>Carregando...</h1>}
    </Main>
  );
};

export default ListDemandsScreen;
