const { Pokemon } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
  app.put('/api/pokemons/:id', auth, (req, res) => {
    const id = req.params.id
    Pokemon.update(req.body, {
      where: { id: id }
    })
      .then(_ => {
        return Pokemon.findByPk(id).then(pokemon => {
          if (pokemon === null) {
            const message = "Le pokémon demandé n'existe pas.";
            return res.status(404).json({ message, data: err });
          }
          const message = `Le pokémon ${pokemon.name} a bien été modifié.`
          res.json({ message, data: pokemon })
        })
      })
      .catch(err => {
        if(err instanceof ValidationError){
          return res.status(400).json({ message: err.message, data: err})
        }
        if(err instanceof UniqueConstraintError){
          return res.status(400).json({ message: err.message, data:err})
        }
        const message = "Modification impossible.";
        res.status(500).json({ message, data:err})
      })
  })
}