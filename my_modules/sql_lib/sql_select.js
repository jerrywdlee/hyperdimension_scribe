var SqlQueries = {
  item_urls : "SELECT item_page,item_page_iphone,item_page_android,item_page_line,item_page_fb,item_page_messenger, "
            + "item_page_twitter,item_page_instagram,item_page_wechat,item_page_qq,item_page_alipay "
            + "FROM items AS i, scenarios AS s WHERE s.scenario_uuid = ? "
            + "AND i.id = s.item_id AND s.deleted <> 1 AND i.deleted <> 1 "
            + "ORDER BY i.updated_at DESC;"
}

module.exports = SqlQueries;
