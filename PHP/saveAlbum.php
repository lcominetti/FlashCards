<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    $id_album = mysqli_real_escape_string($connect, $_POST["id_album"]);
    $email = mysqli_real_escape_string($connect, $_POST["email"]);
    
    $result_str = "SELECT id FROM album_salvati WHERE emailUtente = '$email' AND idAlbum = '$id_album'";
    $result = mysqli_query($connect, $result_str);

    if($result){

        while($row = mysqli_fetch_array($result)){
            $salvati = mysqli_real_escape_string($connect, $row["id"]);
        }

    if (mysqli_num_rows($result)!=0) { exit("saveExisting"); }

    else{

        $insert_saved_str = "INSERT INTO album_salvati(emailUtente, idAlbum) VALUES ('$email', '$id_album')";
        $insert_saved = mysqli_query($connect, $insert_saved_str);
    
        //se non esiste alcun utente con le credenziali inseritee
        if(!$insert_saved){
            echo "error";
        }
        else{
            echo "success";
        }
    }
    }




    

?>