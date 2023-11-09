class DeletePetTest{
    petDeletingWithoutToken(petData){

    }

    petDeletingWithInvalidToken(petData){

    }

    petDeletingWithInvalidRole(petData, defaultUserAuthInfo){

    }

    petDeletingByUserWithoutShelter(petData, userWithoutShelterAuthInfo){

    }

    petDeletingByNotShelterMember(petData, notShelterMemberAuthInfo){

    }

    petDeletingWithInvalidId(petAdminAuthInfo){

    }

    successfulPetDeleting(petData, petAdminAuthInfo){

    }

}

module.exports = new DeletePetTest();