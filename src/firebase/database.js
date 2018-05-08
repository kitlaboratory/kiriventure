import {firebase} from './index';

/**
 * @name getRef
 * @param {*} path
 * @returns {firebase Database ref} 
 */
export const getRef = (path=null) => {
    return firebase.database.ref();
}

/* Departments Crud */

/**
 * @name createDepartment
 * @param {*} name
 * @returns {new added Departments}
 */
export const createDepartment = name => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Departments')
            .push({
                name: name,
            }).then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            })
        }catch(error){
            reject(error);
        }
    })
}

/**
 * @name getDepartments
 * @param {null}
 * @returns {departments array}
 */
export const getDepartments = () => {
    let departments = [];
    return new Promise((resolve, reject) => {
        try{
            const depRef = getRef().child('Departments');
            depRef.on('child_added', snapshot => {
                departments.push({
                    name: snapshot.val().name,
                    id: snapshot.key
                });
                resolve(departments);
            });
        }catch(error){
            reject(error);
        }
    })
}

/**
 * @name deleteDepartment
 * @param {*} depID 
 * @returns {ture => deleted or false => did not delete}
 */
export const deleteDepartment = depID => {
    return new Promise((resolve, reject) => {
        try{
            const depRef = getRef().child('Departments/' + depID);
            depRef.once('value', snapshot => {
                snapshot.ref.remove();
                resolve(true);
            });
        }catch(error){
            reject(error);
        }
    })
}

/**
 * @name updateDepartment
 * @param {*} depID 
 * @param {*} department 
 * @return {new updated department}
 */
export const updateDepartment = (depID, department) => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Departments/' + depID)
            .update({
                name: department
            }).then(response => {resolve(true)})
        }catch(error){
            reject(error);
        }
    })
}

/* End CRUD Departments */

/* Start CRUD Credos */

export const createCredo = name => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Credos')
            .push({
                name: name,
                isActive: false,
            }).then(response => resolve(response))
            .catch(error => reject(error))
        }catch(error) {
            reject(error);
        }
    })
}


/**
 * @name updateCredo
 * @param {*} credoID 
 * @param {*} credo 
 */
export const updateCredo = (credoID, credo) => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Credos/' + credoID)
            .update({
                name: credo
            }).then(response => resolve(true))
        }catch(error){
            reject(error);
        }
    })
}


/**
 * @name getCredos
 * @param {null}
 * @returns {credos}
 */
export const getCredos = () => {
    let credos = [];
    return new Promise((resolve, reject) => {
        try {
            getRef().child('Credos')
            .on('child_added', snapshot => {
                credos.push({
                    name: snapshot.val().name,
                    isActive: snapshot.val().isActive,
                    id: snapshot.key
                });
                resolve(credos);
            })
        }catch(error){
            reject(error)
        }
    })
}

/**
 * @name deleteCredo
 * @param {*} credoID
 * @returns {true => credo deleted or false => credo did not delete}
 */
export const deleteCredo = credoID => {
    return new Promise((resolve, reject) => {
        try{
            const depRef = getRef().child('Credos/' + credoID);
            depRef.once('value', snapshot => {
                snapshot.ref.remove();
                resolve(true);
            });
        }catch(error){
            reject(error);
        }
    })
}


/**
 * @name updateIsActive
 * @param {*} credoID 
 * @param {*} status
 * @returns {new Update credo instance}
 */
export const updateIsActive = (credoID, status) => {
    return new Promise((resolve, reject) => {
        try {
            getRef().child('Credos/' + credoID)
            .update({
                isActive: status
            }).then(response => resolve(true))
        }catch(error) {
            reject(error);
        }
    })
}

/* End Credo CRUD */

/* Start Flow CRUD */

/**
 * @name createFlow
 * @param {*} department 
 * @param {*} name
 * @return {added flow}
 */
export const createFlow = (department, name) => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Flows')
            .push({
                department: department,
                flowName: name
            }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        }catch(error){
            reject(error);
        }
    });
}

/**
 * @name getFlows
 * @param {*} department
 * @returns {flows => array}
 */
export const getFlows = department => {
    const flows = [];
    return new Promise((resolve, reject) =>{
        try{
            getRef().child('Flows').orderByChild('department').equalTo(department)
            .on('child_added', snapshot => {
                flows.push({
                    name: snapshot.val().flowName,
                    id: snapshot.key
                });
                resolve(flows);
            })
        }catch(error){
            reject(error);
        }
    });
}

/**
 * @name deleteFlow
 * @param {*} flowID
 * @return {true => deleted}
 */
export const deleteFlow = flowID => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Flows/'+ flowID)
            .on('value', snapshot => {
                snapshot.ref.remove();
                resolve(true);
            })
        }catch(error){
            reject(error);
        }
    })
}

/**
 * @name updateFlow
 * @param {*} flowID 
 * @param {*} name
 * @return {true => updated}
 */
export const updateFlow = (flowID, name) => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Flows/'+flowID)
            .update({
                flowName: name
            }).then(response => {
                resolve(true);
            })
        }catch(error){
            reject(error);
        }
    })
}

/* END FLOW CRUD */

/* Start USER CRUD */

export const createUser = (department, name, email, role) => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Users')
            .push({
                department: department,
                name: name,
                email: email,
                position: role
            }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            })
        }catch(error){
            reject(error);
        }
    })
}

export const getUsers = department => {
    let users = [];
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Users').orderByChild('department').equalTo(department)
            .on('child_added', snapshot => {
                users.push(snapshot.val());
                users[users.length-1]["id"] = snapshot.key;
                resolve(users);
            });
        }catch(error) {
            reject(error);
        }
    })
}

/**
 * @name updateUser
 * @param userId
 * @param username
 * @param userrole
 * @returns {Promise}
 */

export const updateUser = (userId, username, userrole) => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Users/'+userId)
                .update({
                    name: username,
                    position: userrole
                }).then(response => {
                    resolve(true) ;
            });
        }catch (error){
            reject(error);
        }
    });
};

/**
 * @name deleteUser
 * @param userID
 * @returns {Promise}
 */

export const deleteUser = userID => {
    return new Promise((resolve, reject) => {
        try {
            getRef().child('Users/'+userID)
                .on('value', snapshot => {
                    snapshot.ref.remove();
                    resolve(true);
                });
        }catch (error){
            reject(error);
        }
    })
};

/* End User CRUD */

/* Start Task CRUD */

/**
 * @name createTask
 * @param {*} department 
 * @param {*} name 
 * @param {*} flow
 * @return {new task instance}
 */
export const createTask = (department, name, flow) => {
    return new Promise((resolve, reject) => {
        try {
            getRef().child('Tasks')
            .push({
                name: name,
                flow: flow,
                department: department
            }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error)
            })
        }catch(error){
            resolve(error);
        }
    })
}

/**
 * @name getTasks
 * @param {*} department 
 * @returns {tasks => array}
 */
export const getTasks = department => {
    let tasks = [];
    return new Promise((resolve, reject) => {
        try{
            getRef().child("Tasks").orderByChild('department').equalTo(department)
            .on('child_added', snapshot => {
                getRef().child('Flows/'+snapshot.val().flow)
                .on('value', snapshot2 => {
                    if(snapshot2.val()){
                        tasks.push(snapshot.val());
                        tasks[tasks.length-1]["id"] = snapshot.key;
                        tasks[tasks.length-1]["flowName"] = snapshot2.val().flowName;
                    }
                });
                resolve(tasks);
            });
        }catch(error){
            reject(error);
        }
    })
}

/**
 * @name deleteTask
 * @param {*} taskID
 * @returns {true => deleted} 
 */
export const deleteTask = taskID => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Tasks/'+ taskID)
            .on('value', snapshot=> {
                snapshot.ref.remove();
                resolve(true);
            })
        }catch(error){
            reject(error);
        }
    })
}

/**
 * @name updateTask
 * @param {*} taskID 
 * @param {*} name 
 * @param {*} flow 
 * @returns {true => updated}
 */
export const updateTask = (taskID, name, flow) => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Tasks/' + taskID)
            .update({
                name: name,
                flow: flow
            }).then(response => {
                resolve(true);
            });
        }catch(error){
            reject(error);
        }
    })
}

/* End Task CRUD */

/* Start Review Function */

export const getReviews = (department, user = null, date = null) => {
    let Review_Task = [];
    return new Promise((resolve, reject) => {
        try{
            const reviewRef = getRef().child('Ratings').orderByChild('date').equalTo(date);
            reviewRef.on('value', snapshot => {
                if(snapshot.val() === null){
                    resolve(Review_Task);
                }else{
                    for(const [key, value] of Object.entries(snapshot.val())) {
                        if(user === null) {
                            Review_Task.push(value);
                            Review_Task[Review_Task.length -1]["id"] = key;
                        }else{
                            if(value.userid === user) {
                                Review_Task.push(value);
                                Review_Task[Review_Task.length -1]["id"] = key;
                            }
                        }
                    }
                    resolve(Review_Task);
                }
            });
        }catch(error){
            reject(error);
        }
    })
}


export const managerReview = (rate, rateID) => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child("Ratings/" + rateID)
            .update({
                managerRate: rate
            });
            resolve(true);
        }catch(error) {
            reject(error);
        }
    })
}

/**
 * @name getTaskName
 * @param {*} id 
 * @return {task's name}
 */
export const getTaskName = id => {
    return new Promise((resolve, reject) => {
        try{
            getRef().child('Tasks/'+id)
            .on('value', snapshot => {
                resolve(snapshot.val().name);
            })
        }catch(error){
            reject(error);
        }
    })
}

/* End Review Function */