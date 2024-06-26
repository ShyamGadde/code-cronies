import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import shave from "shave";
import { Loader } from "../components";
import { unsetCredentials } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";

const HomePage = () => {
  const [data, setData] = useState(null);

  const [logout] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(unsetCredentials());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    shave(".text-truncate-2", 50); // 50 is the maximum height in pixels
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users/me/recommendations/", {
          credentials: "include", // include cookies in the request
        });

        if (response.status == 401) {
          logoutHandler();
        }
        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <p className="text-center mb-4">
        Here are some coding buddy recommendations based on your profile.
      </p>
      <Row xs={1} md={2} lg={3} className="g-4">
        {data ? (
          data.map((match, index) => (
            <Col key={index}>
              <Card className="h-100 text-center">
                <Card.Img
                  variant="top"
                  src={match.profile_image || "/default-avatar.png"}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="font-weight-bold my-3">
                    {match.full_name}
                  </Card.Title>
                  <Card.Text className="text-truncate-2">{match.bio}</Card.Text>
                  <Button
                    variant="warning"
                    href={`${match.github_profile}`}
                    target="_blank"
                    className="mt-auto mr-2"
                  >
                    Check out <FaGithub /> GitHub
                  </Button>
                  <Button
                    variant="primary"
                    href={`${match.linkedin_profile}`}
                    target="_blank"
                    className="mt-2"
                  >
                    Connect on <FaLinkedin /> LinkedIn
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Loader />
        )}
      </Row>
    </Container>
  );
};

export default HomePage;
