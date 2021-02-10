import { useStorage } from '@capacitor-community/react-hooks/storage';
import { useEffect, useState } from 'react';


export function useToDoList() {

    // import des fonctions de stockage local
    const { get, set, remove } = useStorage();

    // déclaration de la liste d'items
    let listStocked = [];
    let [listItems, updateList] = useState(listStocked);

    // compteur tâches à faire
    let [counterTodo, setCounterTodo] = useState(0);

    // fonction pour initialiser le compteur d'items non cochés et synchroniser les données stockées en local
    function getCounterTodo() {
        get('counterTodo').then((number) => {
            setCounterTodo(parseInt(number))
        })
    }

    // hook pour utiliser la fonction une seule fois lors de l'affichage de la page
    useEffect(() => {
        getCounterTodo()
    }, [])

    // fonction pour ajouter 1 au compteur
    function addCounterTodo() {
        let count = counterTodo
        count = count + 1
        setCounterTodo(count)
        set('counterTodo', JSON.stringify(count))
    }

    // fonction pour enelever 1 au compteur
    function removeCounterTodo() {
        let count = counterTodo
        count = count - 1
        setCounterTodo(count)
        set('counterTodo', JSON.stringify(count))
    }

    // fonction pour initialiser la liste stockées en local
    function getStockedList() {
        get('listTodo').then((listJson) => {
            if (listJson != null) {
                listStocked = JSON.parse(listJson);

                updateList(listStocked)
            }
        })
    }

    // appeler la fonction une seule fois pour initialiser les items stockés en local
    useEffect(() => {
        getStockedList()
    }, [])

    // fonction pour ajouter des items à la liste
    function addItem(text) {

        // on prépare l'id pour le nouvel objet en prenant le dernier id du tableau actuel et on retire 1 pour débuter à la bonne valeur 
        let lengthList = listItems.length - 1

        const newItem = {
            id: lengthList + 1,
            text: text,
            checked: false
        }

        // on stocke le nouveau tableau avec le nouvel item dans une variable pour l'utiliser dans la fonction update après
        const newTable = listItems.concat([newItem])

        // on ajoute 1 au compteur lors de la création d'une tâche
        addCounterTodo()

        // on ajoute le nouveau tableau au sotckage en local
        set('listTodo', JSON.stringify(newTable))

        // on update la liste en mémoire
        updateList(newTable)
    }

    // fonction pour retirer manuellement une tâche
    function removeItem(id) {
        // on copie la liste afin de pouvoir la manipuler
        let newList = listItems

        // on vérifie si l'item est coché ou non
        if (newList[id].checked === false) {
            // on enlève 1 au compteur
            removeCounterTodo();
        }

        // on supprime l'item voulu dans la nouvelle liste
        delete newList[id]

        // on ajoute les nouvelles valeurs dans le tableau stocké en local
        set('listTodo', JSON.stringify(newList))

        // on update les nouvelles valeurs en mémoire
        updateList(newList)
    }

    // fonction pour modifier le texte d'un item
    function modifieItem(id, text) {
        // on copie la liste pour pouvoir la modifier
        let newList = listItems
        // on attribut la nouvelle valeur du text à la nouvelle liste
        newList[id].text = text

        // on ajoute les nouvelles valeurs dans le tableau stocké en local
        set('listTodo', JSON.stringify(newList))

        // on update les nouvelles valeurs en mémoire
        updateList(newList)
    }

    // fonction pour passer un item de coché à non coché et inversement
    function toggleItem(id) {
        const updatedList = listItems.map(item => {
            if (item.id === id) {
                item.checked = !item.checked
            }
            return item
        })

        // on ajoute les nouvelles valeurs dans le tableau stocké en local
        set('listTodo', JSON.stringify(updatedList))

        // on update les nouvelles valeurs en mémoire
        updateList(updatedList)
    }

    // fonction pour retirer tous les items de la liste
    function removeAllItems() {

        // on enlève la liste stockée en local
        remove('listTodo');

        // on vide la liste stockée en mémoire
        updateList([]);

        // on enlève le compteur stocké en local
        set('counterTodo', JSON.stringify(0));

        // on réinitialise le compteur en mémoire
        setCounterTodo(0);
    }


    return {
        listItems, addItem, toggleItem, removeAllItems, counterTodo, setCounterTodo, removeCounterTodo, addCounterTodo, removeItem, modifieItem
    }

}