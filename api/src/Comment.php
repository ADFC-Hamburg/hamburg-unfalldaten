<?php
/**
 * @Entity @Table(name="comments")
 **/
class Comment
{
    /** @Id @Column(type="integer") @GeneratedValue
     * @var int
     **/
    protected $id;

     /** @Column(type="string") 
      * @var string
      **/
    protected $subject;

     /** @Column(type="string") 
      * @var string
      **/
    protected $description;

    /**
     * @Column(type="datetime")
     * @var DateTime
     */
    protected $created;

     /** @Column(type="string") 
      * @var string
      **/
    protected $creator;

     /** @Column(type="string") 
      * @var string
      **/
    protected $creatoremail;

    /**  @Column(type="integer") 
     * @var int
     **/
    protected $status;

    /**  @Column(type="integer") 
     * @var int
     **/
    protected $lfnr;



    public function getId()
    {
        return $this->id;
    }

    public function getSubject()
    {
        return $this->subject;
    }

    public function setSubject($subject)
    {
        $this->subject = $subject;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setCreated($created)
    {
        $this->created = $created;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    public function getCreatorEmail()
    {
        return $this->creatoremail;
    }

    public function setCreatorEmail($creatoremail)
    {
        $this->creatoremail = $creatoremail;
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function setStatus($status)
    {
        $this->status = $status;
    }
    public function setLfnr($lfnr)
    {
        $this->lfnr = $lfnr;
    }


}