import moment from 'moment';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import DeleteButton from './DeleteButton';
import LikeButton from './LikeButton';

function PostCard({ post: { body, createdAt, id, username, likes, likeCount, commentCount, comments } }) {

    const { user } = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                    <Button color='blue' basic>
                        <Icon name='comments' />
                    </Button>
                    <Label as='a' basic color='blue' pointing='left'>
                        {commentCount}
                    </Label>
                </Button>
                {user && user.username === username && (<DeleteButton post={id} />)}
            </Card.Content>
        </Card>

    )

}

export default PostCard;