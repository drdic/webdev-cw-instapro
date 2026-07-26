if (page === POSTS_PAGE) {
  return renderPostsPageComponent({
    appEl,
  });
}

if (page === USER_POSTS_PAGE) {
  return renderUserPostsPageComponent({
    appEl,
  });
}
