
const logger  = (name)=>{
    const log = (message) => {console.log(`${name} : ${message}`)}
    const warn = (message) => {console.error(`${name} : ${message}`)} 
    return { log, warn }; 
}
module.exports = logger