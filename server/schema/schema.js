const graphql = require('graphql');
const _ = require('lodash'); 
const axios = require('axios'); 



const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLList, 
    GraphQLInt
} = graphql;

// const octocats = [
//     {id: 22,prenom: "Cedric",nom: "Van Hove",gitHub: "cevaho",linkedIn: "https://www.linkedin.com/in/c%C3%A9dric-van-hove-99250926/",promo: "johnson"},
//     {id: 1, prenom: "Maxime", nom: "Broodcoorens",gitHub: "Broodco", linkedIn: "https://www.linkedin.com/in/maxime-broodcoorens-783472168/", promo: "lovelace" },
//     {id: 2, prenom: "Emilie", nom: "Bialais",gitHub: "ebialais",linkedIn:"https://www.linkedin.com/in/emilie-bialais-b4b67658/", promo: "lovelace" },
//     {id: 3,prenom: "Pierre-Louis ",nom: "Picard",gitHub: "Pierre-Louis242",linkedIn:"https://www.linkedin.com/in/pierre-louis-picard-b30993a8/",promo: "lovelace"},
//     {id: 4,prenom: "Mathilde",nom: "Baquet",gitHub: "MathildeBa",linkedIn:"https://www.linkedin.com/in/mathilde-baquet",promo: "lovelace"},
//     {id: 19,prenom: "Antoine",nom: "Diambu",gitHub: "AntoineDia",linkedIn: "https://www.linkedin.com/in/antoine-diambu-402776178/",promo: "johnson" }
// ]

// const watches = [
//     {id: "1", octocatId: "3", date: "190319", subject: "Power BI", link: "https://powerbi.microsoft.com/fr-fr/"},
//     {id: "2", octocatId: "2", date: "150419", subject: "Black Hole", link:  "https://drive.google.com/open?id=1ZWgEnRzZyCS5RX0AoEPfinbIbmfAQo1Y-JT1E-CyRsU"},
//     {id: "3", octocatId: "2", date: "250219", subject: "La minute santé", link: "https://docs.google.com/presentation/d/1bVct12Ttw16G7B-"},
//     {id: "4", octocatId: "1", date: "180419", subject: "Back-end: choix d'une technologie", link: "https://slides.com/broodco/deck-1#/"},
//     {id: "5", octocatId: "2", date: "20519", subject: "Performance", link: "https://docs.google.com/presentation/d/1g3YF0yUndVZ0n2wGrFxL_85ChPPFjcn0sTLiux2T6aI/edit?usp=sharing"},
//     {id: "6", octocatId: "3", date: "40219", subject: "Photo Wake-up 3D, donner vie aux images", link:  "https://github.com/Pierre-louis242/The-Watch-"},
//     {id: "7", octocatId: "1", date: "210219", subject: "Raspberry Pi", link: "https://www.raspberrypi.org/"}
// ]

const UserType = new GraphQLObjectType ({ 
    name: 'octocat',
    fields: () => ({
        id: {type: GraphQLID},
        prenom: {type: GraphQLString},
        nom: {type: GraphQLString},
        gitHub: {type: GraphQLString},
        linkedIn: {type: GraphQLString},
        promo: {type: GraphQLString},
        // watches: {
        //     type: new GraphQLList(WatchType),
        //     resolve(parent, args){
        //         return _.filter(watches, { octocatId: parent.id});
        // }}
    })
}); 

const WatchType = new GraphQLObjectType ({
    name: 'watch',
    fields: () => ({
        id: {type: GraphQLID},
        octocatId: { 
            type: UserType,
            resolve(parent, args){ 
                return _.find(octocats, {id: parent.octocatId});
            }
        },
        date: {type: GraphQLString},
        subject: {type: GraphQLString},
        link: {type: GraphQLString}
    })
});


const RootQuery = new GraphQLObjectType({ 
    name: 'RootQueryType',
    fields: { 
        octocat: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){ 
                return axios.get('https://api.sheety.co/97ac06ad-6ce3-4719-ad8d-8ea8711b328b')
                    .then(function (response) {
                        const resultat = response.data;
                        //let a = resultat.find((item) => item.id === id)
                        return resultat.find((item) => item.id == args.id)
                    })
                    .catch(function (error) {
                        throw new Error(error.message)
                    })            
            }
        },

        watch: {
            type: WatchType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                return _.find(watches, {id: args.id});
            }
        },

        octocats: { 
            type: new GraphQLList(UserType),
            resolve(parent, args) { 
                return axios.get('https://api.sheety.co/97ac06ad-6ce3-4719-ad8d-8ea8711b328b')
                    .then(function (response) {
                        return response.data
                    })
                    .catch(function (error) {
                        throw new Error(error.message)
                    })
            }
        },
        watches: {
            type: new GraphQLList(WatchType),
            resolve(parent, args) {
                return watches
            }
        }
    }
}) 

module.exports = new GraphQLSchema({ 
    query: RootQuery,    
})
