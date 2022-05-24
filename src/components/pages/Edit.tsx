import css from "./Edit.module.css";

import Loading from "../layout/Loading";
import Container from "../layout/Container";
import Message from "../layout/Message";

import { Project } from "../interfaces/Project";
import { Servico } from "../interfaces/Service";

import ServiceForm from "../services/ServiceForm";
import ServiceCard from '../services/ServiceCard'

import ProjectForm from "../project/ProjectForm";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'

function Edit() {
  const { id } = useParams();
  const [project, setProject] = useState<Project>();
  const [services, setServices] = useState<Servico[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState<string>();
  const [type, setType] = useState<string>();

  useEffect(() => {
    setTimeout(() => {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          const projetos: Servico[] = data
          setProject(data)
          setServices(data.services)
        })
        .catch((err) => console.log(err));
    }, 300);
  }, [id]);

  function editPost(project) {
    setMessage("");
    // budget validation
    if (project.budget < project.cost) {
      setMessage("O orçamento não pode ser menor que o custo do projeto!");
      setType("error");
      return false;
    }

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false); //or (!showProjectForm)
        setMessage("Projeto Atualizado!");
        setType("success");
      })
      .catch((err) => console.log(err));
  }

  function createService(project) {
    setMessage('')

    const lastService = project.services[project.services.length - 1]
    lastService.id = uuidv4()
    const lastServiceCost = lastService.cost
    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

    //maximum value validation
    if (newCost > parseFloat(project.budget)) {
      setMessage("Orçamento ultrapassado! verifique o valor do serviço")
      setType('error')
      project.services.pop()
      return false
    }

    if (lastService.cost < 0 || newCost < 0) {
      setMessage("Valor Negativo! Corrija o valor do serviço")
      setType('error')
      project.services.pop()
      return false
    }

    //add service cost to project total cost
    project.cost = newCost

    //update project
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(project)
    }).then((resp) => resp.json())
      .then((data) => {
        setShowServiceForm(false)
      })
      .catch((err) => console.log(err))
  }

  function removeService(id, cost) {

    setMessage('')

    if (project != undefined) {
      const servicesUpdated = project.services.filter(
        (service) => service.id !== id,
      )

      const projectUpdated = project

      projectUpdated.services = servicesUpdated
      projectUpdated.cost = projectUpdated.cost - cost

      fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectUpdated),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setProject(projectUpdated)
          setServices(servicesUpdated)
          setMessage('Serviço removido com sucesso!')
          setType('success')
        })
    }
  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }



  return (
    <>
      {project?.name ? (
        <div className={css.edit_details}>
          <Container customClass="column">
            {message && <Message type={type} msg={message} />}
            <div className={css.details_container}>
              <h1>{project.name}</h1>
              <button className={css.btn} onClick={toggleProjectForm}>
                {!showProjectForm ? "Editar Projeto" : "Fechar"}
              </button>
              {!showProjectForm ? (
                <div className={css.project_info}>
                  <p>
                    <span>Categoria: </span>
                    {project.category.name}
                  </p>

                  <p>
                    <span>Total de Orçamento: </span>
                    {/* {project.budget.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})} */}
                    {project.budget}
                  </p>

                  <p>
                    <span>Total Utilizado: </span>
                    {project.cost.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}
                  </p>
                </div>
              ) : (
                <div className={css.project_info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>
            <div className={css.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button className={css.btn} onClick={toggleServiceForm}>
                {!showServiceForm ? "Adicionar Serviço" : "Fechar"}
              </button>
              <div className={css.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar Serviço"
                    projectData={project}

                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 &&
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))}
              {services.length === 0 && <p>Não há serviços cadastrados.</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Edit;