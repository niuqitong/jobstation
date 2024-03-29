import {useParams, useNavigate} from "react-router-dom";
import {Button, Link, Stack} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {isLoggedIn, UserContext} from "../../../context/User";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";

export default function Post(props) {
    const {user} = useContext(UserContext);
    const { postId } = useParams();
    const [post, setPost] = useState("");
    const [isUser,setIsUser] = useState(true);
    const navigate = useNavigate();
    console.log(postId)

    useEffect(()=>{
        fetch(`/discuss/post/${postId}`)
            .then((res) => res.json())
            .then((fetched) => {
                setPost(fetched);
            });
    },[])

    const avatarSrc = `https://ui-avatars.com/api/?name=${post.creator}&background=random&bold=true`;
    let postTags = post.tags;
    if(postTags===undefined){
        postTags=[];
    }

    useEffect(()=>{
        if(!isLoggedIn(user)){
            return;
        }
        if(user._id === post.creator){
            setIsUser(true);
        }
        else{
            setIsUser(false);
        }
    },[post])

    const handleEdit = (event) => {
        navigate('/discussion/edit')
    };

    const handleDelete = async () => {
        // alert
        await fetch(`/discuss/post/${postId}`, {
            method: "delete",
        }).then((res) => console.log(res));
        // show success
        navigate('/discussion');
    };

    const handleLike = async () => {
        await fetch(`/discuss/like/${postId}`,{
            method: "PATCH",
        }).
            then((res) => res.json());
        setPost(prePost =>{
            return {...prePost, likeCount: prePost.likeCount+1}
        })
    }

    return (

        <div className="container py-lg-5 py-3 container-lg vh-100">
            <div className='d-flex justify-content-between align-items-baseline'>
                <h1>{post.title}</h1>

                {
                    isUser?
                    <div className='d-flex flex-row align-content-center justify-content-center'>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={handleEdit}>
                                Edit
                            </Button>
                            <Button variant="outlined" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Stack>
                    </div>
                        :
                        (
                            <></>
                        )
                }
            </div>
            <Avatar src={avatarSrc} />
            <div className="text-muted small mb-4">
                <div className="d-flex flex-row align-items-center my-2 justify-content-start">
                    <strong>{post.creator}</strong>
                    <div className='text-muted ms-auto'>last updated {`${post.createdAt}`}</div>
                </div>
            </div>
            <div className='d-flex flex-row align-items-center my-2 justify-content-start'>
                tags:<strong className="text-muted">{postTags.map((tag) => {
                    const newPage = `/discussion/search-result/${tag}`;
                return <Link href={newPage} className="btn btn-outline-secondary btn-sm mx-1" underline="none">
                    {tag}
                </Link>
            })}
            </strong>
                <IconButton className='ms-auto' aria-label="add to favorites" onClick={handleLike}>
                    <ThumbUpOffAltOutlinedIcon sx={{color:'pink'}}/>
                </IconButton>
                <span> {post.likeCount} Likes </span>
            </div>
            <hr />
            <div className=' body-content'>
                {post.message}
            </div>
        </div>
    );
}
