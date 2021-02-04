 import React, { Component } from "react";
 import "./App.css";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

//console.log(url);


/*ES5
 function isSearched(searchTerm) {
   return function (item) {
     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
   };
 }
*/

 /* ES6*/
  const isSearched = (searchTerm) => (item) =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase()); 

 class App extends Component {
   constructor(props) {
     super(props);
     this.state = {
       result:null ,
       searchTerm: "",
     };

     this.onDismiss = this.onDismiss.bind(this);
     this.onSearchChange = this.onSearchChange.bind(this);
   }

   onDismiss(id) {
     const isNotId = (item) => item.objectID !== id;
     const updatedList = this.state.list.filter(isNotId);
     this.setState({ list: updatedList });
   }

   onSearchChange(event) {
     this.setState({ searchTerm: event.target.value });
   }

   render() {
     const { searchTerm, list } = this.state;
     return (
       <div className="page">
         <div className="interactions">
           <Search value={searchTerm} onChange={this.onSearchChange}>
             Search
           </Search>
         </div>
         <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
       </div>
     );
   }
 }

 export default App;

 const Search = ({ value, onChange, children }) => {
   return (
     <form>
       {children} <input type="text" value={value} onChange={onChange} />
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

 const Table = ({ list, pattern, onDismiss }) => {
   const largeColumn = { width: "40%" };
   return (
     <div className="table">
       {list.filter(isSearched(pattern)).map((item) => (
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