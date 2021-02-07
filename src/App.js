 import React, { Component } from "react";
 import "./App.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = 'page=';
const PARAM_HPP = "hitsPerPage=";

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

//console.log(url); 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error:null,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
}

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    //const oldHits = page !== 0 ? this.state.results.hits : [];

    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    //this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((results) => this.setSearchTopStories(results))
      .catch((error) => this.setState({ error }) );
  }

  /* fetch the data from the Hacker News API asynchronously.  */
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const [searchKey, results] = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
    });
  }

  render() {
    const { searchTerm, results, searchKey,error } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;

    const list =(results && results[searchKey] && results[searchKey].hits) || [];

    /*if (error) {
      return <p>Something went wrong.</p>;
    }*/

    if (!results) {
      return null;
    }
    
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {results ? (
          <Table
            list={list}
            onDismiss={this.onDismiss}             
          />
        ) : null}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </Button>
        </div>

        { error
          ?
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>          
          : <Table
            list={list}
            onDismiss={this.onDismiss}             
          />
        }
      </div>
    );
  }
}


 export default App;

 const Search = ({ value, onChange, onSubmit,children }) => {
   return (
     <form onSubmit={onSubmit}>
       <input
         type="text"
         value={value}
         onChange={onChange}          
        />
       <button
         type="submit">
         {children}
       </button>
     </form>
   );
 };

 const Button = ({ onClick, className, children }) => {
   return (
     <button onClick={onClick} className="" type="button">
       {children}
     </button>
   );
 };

 const Table = ({ list, onDismiss }) => {
   const largeColumn = { width: "40%" };
   return (
     <div className="table">
       {list.map((item) => (
         <div key={item.objectID} className="table-row">
           <span style={largeColumn}>
             <a href={item.url}> {item.title}</a>
           </span>
           <span style={{ width: "30%" }}>{item.author}</span>
           <span stye={{ width: "10%" }}>{item.num_comments}</span>
           <span stye={{ width: "10%" }}>{item.points}</span>
           <span style={{ widht: "10%" }}>
             <Button
               onClick={() => onDismiss(item.objectID)}
               className="button-inline"
             >
               Dismiss
             </Button>
           </span>
         </div>
       ))}
     </div>
   );
 };