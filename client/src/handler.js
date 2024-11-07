export const handleEdit = (follower, onEdit, navigate) => {
    onEdit(follower);
    navigate('/');
  };
  
  export const handleDelete = (id, setMessage, getFollowers) => {
    axios.delete(`http://localhost:3001/followers/${id}`)
      .then(() => {
        setMessage("Seguidor excluído com sucesso!");
        getFollowers();
      })
      .catch((error) => {
        setMessage("Erro ao excluir seguidor.");
        console.error("Erro ao excluir follower:", error);
      });
  };
  